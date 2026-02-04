import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { Platform, PermissionsAndroid } from 'react-native';
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
    private threshold = 12;

    // GPS Tracking
    startLocationTracking(onData: (lat: number, lng: number) => void) {
        Geolocation.watchPosition(
            (position) => {
                onData(position.coords.latitude, position.coords.longitude);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
        );
    }

    stopLocationTracking() {
        Geolocation.stopObserving();
    }

    // Sound Level (Real)
    startNoiseSensor(onData: (db: number) => void) {
        RNSoundLevel.start();
        const subscription = RNSoundLevel.onNewFrame = (data: any) => {
            // RNSoundLevel returns value in dB relative to full scale (usually negative)
            // We'll normalize it to a "noise level" 0-100 range for the UI
            const level = Math.max(0, data.value + 100);
            onData(Math.floor(level));
        };
        return subscription;
    }

    stopNoiseSensor() {
        RNSoundLevel.stop();
    }

    // Pedometer (Real System Count)
    startPedometer(onData: (steps: number, activity: number) => void) {
        // First, let's try to get initial steps for today
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        Pedometer.queryPedometerDataBetweenDates(startOfDay.getTime(), now.getTime(), (error: any, data: any) => {
            if (data) {
                this.stepCount = data.numberOfSteps;
                onData(this.stepCount, 50); // Initial activity
            }
        });

        // Start real-time updates
        Pedometer.startPedometerUpdatesFromDate(now.getTime(), (data: any) => {
            if (data) {
                const totalSteps = this.stepCount + data.numberOfSteps;
                onData(totalSteps, 80);
            }
        });

        // Fallback to Accelerometer for "Activity Level" visualization
        if (!this.accelerometerSubscription) {
            this.accelerometerSubscription = accelerometer
                .pipe(
                    map(({ x, y, z }: any) => Math.sqrt(x * x + y * y + z * z))
                )
                .subscribe((acceleration: any) => {
                    const activity = Math.min(100, Math.max(0, (acceleration - 9.8) * 10));
                    onData(this.stepCount, activity);
                });
        }
    }

    stopPedometer() {
        Pedometer.stopPedometerUpdates();
        if (this.accelerometerSubscription) {
            this.accelerometerSubscription.unsubscribe();
            this.accelerometerSubscription = null;
        }
    }

    // Light Sensor (Simulated for now as it's very device specific on Android)
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
