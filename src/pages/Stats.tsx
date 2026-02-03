import { useGameStore } from '../stores/gameStore';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

export default function Stats() {
  const { scores, gamesPlayed, highScore } = useGameStore();
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-3xl font-bold text-white">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="text-sm opacity-70">Games Played</p>
          <p className="text-3xl font-bold">{gamesPlayed}</p>
        </div>
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="text-sm opacity-70">High Score</p>
          <p className="text-3xl font-bold">{highScore}</p>
        </div>
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="text-sm opacity-70">Average Score</p>
          <p className="text-3xl font-bold">{avgScore}</p>
        </div>
      </div>
    </div>
  );
}
