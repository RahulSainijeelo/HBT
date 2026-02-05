import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { NativeModules, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNSoundLevel from 'react-native-sound-level';

const { Pedometer } = NativeModules;

setUpdateIntervalForType(SensorTypes.accelerometer, 100);

export interface SensorData {
    steps?: number;
    activityLevel?: number;
    lux?: number;
    noiseLevel?: number;
    location?: { latitude: number; longitude: number };
}

class SensorService {
    private accelerometerSubscription: any = null;
    private stepCount = 0;
    private lastPosition: { latitude: number; longitude: number } | null = null;
    private totalDistance = 0; // in meters
    private lastStepTime = 0; // Cooldown for step detection
    private threshold = 14.5; // Higher threshold - requires actual walking motion
    private stepCooldown = 400; // Minimum 400ms between steps (prevents shaking)
    private isNoiseSensorRunning = false;

    resetDistance() {
        this.totalDistance = 0;
        this.lastPosition = null;
    }

    resetSteps() {
        this.stepCount = 0;
    }

    // GPS Tracking - STRICT mode to prevent table drift
    startLocationTracking(initialDistance: number, onData: (lat: number, lng: number, distance: number) => void) {
        if (!Geolocation) {
            console.warn("Geolocation module not found");
            return;
        }
        this.totalDistance = initialDistance;
        Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy, speed } = position.coords;

                // STRICT: Only accept high accuracy GPS readings (< 20m)
                if (accuracy > 20) return;

                // STRICT: Ignore if speed is essentially zero (stationary)
                if (speed !== null && speed < 0.3) return; // less than 1 km/h

                if (this.lastPosition) {
                    const d = this.calculateDistance(
                        this.lastPosition.latitude,
                        this.lastPosition.longitude,
                        latitude,
                        longitude
                    );

                    // STRICT: Only add if movement is greater than 5 meters
                    if (d > 5) {
                        this.totalDistance += d;
                        this.lastPosition = { latitude, longitude };
                    }
                } else {
                    this.lastPosition = { latitude, longitude };
                }

                onData(latitude, longitude, this.totalDistance);
            },
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
                distanceFilter: 5, // Only trigger after 5m movement
                interval: 5000,
                fastestInterval: 3000
            }
        );
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371e3; // meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // meters
    }

    stopLocationTracking() {
        if (Geolocation) Geolocation.stopObserving();
    }

    // Sound Level (Real)
    startNoiseSensor(onData: (db: number) => void) {
        if (!RNSoundLevel) {
            console.warn("SoundLevel module not found");
            return null;
        }
        try {
            if (this.isNoiseSensorRunning) return;
            RNSoundLevel.start();
            this.isNoiseSensorRunning = true;
            RNSoundLevel.onNewFrame = (data: any) => {
                const level = Math.max(0, data.value + 100);
                onData(Math.floor(level));
            };
        } catch (e) {
            console.warn("Failed to start noise sensor", e);
        }
    }

    stopNoiseSensor() {
        if (RNSoundLevel && this.isNoiseSensorRunning) {
            try {
                RNSoundLevel.stop();
                this.isNoiseSensorRunning = false;
            } catch (e) {
                console.warn("Error stopping sound level", e);
            }
        }
    }

    // Pedometer (Real System Count with Fallback)
    startPedometer(initialSteps: number, onData: (steps: number, activity: number) => void) {
        this.stepCount = initialSteps;
        this.lastStepTime = 0;
        const now = new Date();

        let usePedometer = false;
        let lastAcceleration = 9.8;
        let wasAboveThreshold = false;

        // Guard against null Pedometer or internal failures
        if (Pedometer && typeof Pedometer.queryPedometerDataBetweenDates === 'function') {
            try {
                Pedometer.startPedometerUpdatesFromDate(now.getTime(), (data: any) => {
                    if (data) {
                        onData(this.stepCount + data.numberOfSteps, 80);
                    }
                });
                usePedometer = true;
            } catch (e) {
                console.warn("Pedometer hardware failed, using accelerometer");
            }
        }

        if (!this.accelerometerSubscription) {
            this.accelerometerSubscription = accelerometer
                .pipe(
                    map(({ x, y, z }: any) => Math.sqrt(x * x + y * y + z * z))
                )
                .subscribe((acceleration: any) => {
                    const activity = Math.min(100, Math.max(0, (acceleration - 9.8) * 10));

                    // Step detection with COOLDOWN to prevent shaking
                    if (!usePedometer) {
                        const currentTime = Date.now();
                        const isAboveThreshold = acceleration > this.threshold;

                        // Count step only on rising edge AND if cooldown has passed
                        if (isAboveThreshold && !wasAboveThreshold) {
                            if (currentTime - this.lastStepTime > this.stepCooldown) {
                                this.stepCount++;
                                this.lastStepTime = currentTime;
                            }
                        }
                        wasAboveThreshold = isAboveThreshold;
                    }
                    lastAcceleration = acceleration;
                    onData(this.stepCount, activity);
                });
        }
    }

    stopPedometer() {
        if (Pedometer && typeof Pedometer.stopPedometerUpdates === 'function') {
            try {
                Pedometer.stopPedometerUpdates();
            } catch (e) { }
        }
        if (this.accelerometerSubscription) {
            this.accelerometerSubscription.unsubscribe();
            this.accelerometerSubscription = null;
        }
    }

    // Light Sensor (Simulated)
    startLightSensor(onData: (lux: number) => void) {
        return setInterval(() => {
            onData(Math.floor(Math.random() * 500));
        }, 1000);
    }

    stopLightSensor(interval: any) {
        if (interval) clearInterval(interval);
    }
}

export const sensorService = new SensorService();
