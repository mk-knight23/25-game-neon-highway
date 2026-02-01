import { COLORS } from '../core/constants';
import { gameState } from '../core/state';

export type WeatherType = 'clear' | 'rain' | 'fog';

export class WeatherSystem {
    private type: WeatherType = 'clear';
    private intensity: number = 0;
    private raindrops: { x: number, y: number, speed: number, length: number }[] = [];

    constructor() {
        this.initRain();
    }

    private initRain() {
        for (let i = 0; i < 100; i++) {
            this.raindrops.push({
                x: Math.random() * 500,
                y: Math.random() * 800,
                speed: 10 + Math.random() * 10,
                length: 5 + Math.random() * 10
            });
        }
    }

    public setWeather(type: WeatherType) {
        this.type = type;
        this.intensity = 0;
    }

    public update() {
        if (this.type === 'rain') {
            this.intensity = Math.min(1, this.intensity + 0.01);
            this.raindrops.forEach(drop => {
                drop.y += drop.speed;
                if (drop.y > 800) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * 500;
                }
            });
            // Affect game state: reduce player friction/control
            gameState.setSpeed(gameState.getState().speed * 0.999);
        } else if (this.type === 'fog') {
            this.intensity = Math.min(1, this.intensity + 0.01);
        } else {
            this.intensity = Math.max(0, this.intensity - 0.01);
        }
    }

    public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        if (this.type === 'rain' && this.intensity > 0) {
            ctx.strokeStyle = `rgba(174, 194, 224, ${this.intensity * 0.5})`;
            ctx.lineWidth = 1;
            this.raindrops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();
            });
        }

        if (this.type === 'fog' && this.intensity > 0) {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, `rgba(50, 50, 70, ${this.intensity * 0.4})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
    }

    public getType(): WeatherType {
        return this.type;
    }

    public getIntensity(): number {
        return this.intensity;
    }
}

export const weatherSystem = new WeatherSystem();
