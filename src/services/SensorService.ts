import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { Platform } from 'react-native';

setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 10Hz

export interface SensorData {
    steps?: number;
    activityLevel?: number;
    lux?: number;
    noiseLevel?: number;
    isCharging?: boolean;
}

class SensorService {
    private accelerometerSubscription: any = null;
    private lightSubscription: any = null;

    // Derived values
    private lastX = 0;
    private lastY = 0;
    private lastZ = 0;
    private stepCount = 0;
    private threshold = 12; // Simple step threshold

    startPedometer(onData: (steps: number, activity: number) => void) {
        if (this.accelerometerSubscription) return;

        this.accelerometerSubscription = accelerometer
            .pipe(
                map(({ x, y, z }: any) => {
                    const acceleration = Math.sqrt(x * x + y * y + z * z);
                    return acceleration;
                })
            )
            .subscribe((acceleration: any) => {
                // Simple step detection logic
                if (acceleration > this.threshold) {
                    this.stepCount++;
                }
                // Activity level is a normalized value of movement
                const activity = Math.min(100, Math.max(0, (acceleration - 9.8) * 10));
                onData(this.stepCount, activity);
            });
    }

    stopPedometer() {
        if (this.accelerometerSubscription) {
            this.accelerometerSubscription.unsubscribe();
            this.accelerometerSubscription = null;
        }
    }

    startLightSensor(onData: (lux: number) => void) {
        if (this.lightSubscription) return;

        // Simulate for now as light sensor module access varies
        this.lightSubscription = setInterval(() => {
            onData(Math.floor(Math.random() * 500));
        }, 1000);
    }

    stopLightSensor() {
        if (this.lightSubscription) {
            clearInterval(this.lightSubscription);
            this.lightSubscription = null;
        }
    }

    // Noise level Mock
    startNoiseSensor(onData: (db: number) => void) {
        return setInterval(() => {
            const db = Math.floor(30 + Math.random() * 20);
            onData(db);
        }, 500);
    }
}

export const sensorService = new SensorService();
