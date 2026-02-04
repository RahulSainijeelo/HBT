import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNSoundLevel from 'react-native-sound-level';
import Pedometer from 'react-native-pedometer';

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
    private threshold = 12;

    // GPS Tracking
    startLocationTracking(onData: (lat: number, lng: number, distance: number) => void) {
        if (!Geolocation) {
            console.warn("Geolocation module not found");
            return;
        }
        Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                if (this.lastPosition) {
                    const d = this.calculateDistance(
                        this.lastPosition.latitude,
                        this.lastPosition.longitude,
                        latitude,
                        longitude
                    );
                    this.totalDistance += d;
                }

                this.lastPosition = { latitude, longitude };
                onData(latitude, longitude, this.totalDistance);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
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
            RNSoundLevel.start();
            RNSoundLevel.onNewFrame = (data: any) => {
                const level = Math.max(0, data.value + 100);
                onData(Math.floor(level));
            };
        } catch (e) {
            console.warn("Failed to start noise sensor", e);
        }
    }

    stopNoiseSensor() {
        if (RNSoundLevel) RNSoundLevel.stop();
    }

    // Pedometer (Real System Count with Fallback)
    startPedometer(onData: (steps: number, activity: number) => void) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let usePedometer = false;

        // Guard against null Pedometer or internal failures
        if (Pedometer && typeof Pedometer.queryPedometerDataBetweenDates === 'function') {
            try {
                Pedometer.queryPedometerDataBetweenDates(startOfDay.getTime(), now.getTime(), (error: any, data: any) => {
                    if (data) {
                        this.stepCount = data.numberOfSteps;
                        onData(this.stepCount, 50);
                    }
                });

                Pedometer.startPedometerUpdatesFromDate(now.getTime(), (data: any) => {
                    if (data) {
                        const totalSteps = this.stepCount + data.numberOfSteps;
                        onData(totalSteps, 80);
                    }
                });
                usePedometer = true;
            } catch (e) {
                console.warn("Pedometer failed to start, falling back to accelerometer", e);
            }
        } else {
            console.warn("Pedometer module not available, using accelerometer fallback");
        }

        // Always run accelerometer for "Activity Level" visualization
        // If pedometer is missing, also use it to increment steps (rough estimate)
        if (!this.accelerometerSubscription) {
            this.accelerometerSubscription = accelerometer
                .pipe(
                    map(({ x, y, z }: any) => Math.sqrt(x * x + y * y + z * z))
                )
                .subscribe((acceleration: any) => {
                    const activity = Math.min(100, Math.max(0, (acceleration - 9.8) * 10));

                    // Rough step detection if hardware pedometer is missing
                    if (!usePedometer && acceleration > this.threshold) {
                        this.stepCount++;
                    }

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
