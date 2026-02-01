import { gameState } from '../core/state';
import { COLORS } from '../core/constants';

interface GhostFrame {
    x: number;
    y: number;
    time: number;
}

export class GhostSystem {
    private recording: GhostFrame[] = [];
    private playback: GhostFrame[] = [];
    private startTime: number = 0;
    private isRecording: boolean = false;

    public startRecording() {
        this.recording = [];
        this.startTime = Date.now();
        this.isRecording = true;
    }

    public stopRecording() {
        this.isRecording = false;
        return this.recording;
    }

    public setPlayback(ghost: GhostFrame[]) {
        this.playback = ghost;
    }

    public recordFrame() {
        if (!this.isRecording) return;
        const player = gameState.getPlayer();
        this.recording.push({
            x: player.x,
            y: player.y,
            time: Date.now() - this.startTime
        });
    }

    public draw(ctx: CanvasRenderingContext2D, roadX: number) {
        if (this.playback.length === 0) return;

        const elapsed = Date.now() - this.startTime;
        const frame = this.playback.find(f => f.time >= elapsed);

        if (frame) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            this.ctx_drawGhostCar(ctx, roadX + frame.x, frame.y, 50, 80);
            ctx.restore();
        }
    }

    private ctx_drawGhostCar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.shadowColor = COLORS.neonBlue;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = COLORS.neonBlue;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 5, y, w - 10, h);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.fillRect(x + 5, y, w - 10, h);
    }
}

export const ghostSystem = new GhostSystem();
