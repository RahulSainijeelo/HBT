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
    private lastStepPersisted = 0;
    private threshold = 12.0; // Reduced from 15 to 12 to make it more sensitive
    private isNoiseSensorRunning = false;

    resetDistance() {
        this.totalDistance = 0;
        this.lastPosition = null;
    }

    resetSteps() {
        this.stepCount = 0;
    }

    // GPS Tracking
    startLocationTracking(initialDistance: number, onData: (lat: number, lng: number, distance: number) => void) {
        if (!Geolocation) {
            console.warn("Geolocation module not found");
            return;
        }
        this.totalDistance = initialDistance;
        Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Filter out low accuracy updates (be more lenient)
                if (accuracy > 60) return;

                if (this.lastPosition) {
                    const d = this.calculateDistance(
                        this.lastPosition.latitude,
                        this.lastPosition.longitude,
                        latitude,
                        longitude
                    );

                    // Only add if movement is greater than 1 meter to avoid table drift
                    if (d > 1.5) {
                        this.totalDistance += d;
                    }
                }

                this.lastPosition = { latitude, longitude };
                onData(latitude, longitude, this.totalDistance);
            },
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
                distanceFilter: 1,
                interval: 2000,
                fastestInterval: 1000
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
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let usePedometer = false;
        let lastAcceleration = 9.8;

        // Guard against null Pedometer or internal failures
        if (Pedometer && typeof Pedometer.queryPedometerDataBetweenDates === 'function') {
            try {
                Pedometer.startPedometerUpdatesFromDate(now.getTime(), (data: any) => {
                    if (data) {
                        // Offset by initial steps if we just started
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

                    // Improved peak detection
                    if (!usePedometer) {
                        if (acceleration > this.threshold && lastAcceleration <= this.threshold) {
                            this.stepCount++;
                        }
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
