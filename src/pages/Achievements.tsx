import { Award, Lock, Trophy, Star } from 'lucide-react';

const achievements = [
  { id: 'first', name: 'First Steps', desc: 'Play your first game', icon: <Star size={24} />, unlocked: true },
  { id: 'score-100', name: 'Century', desc: 'Score 100 points', icon: <Trophy size={24} />, unlocked: false },
  { id: 'score-500', name: 'Champion', desc: 'Score 500 points', icon: <Award size={24} />, unlocked: false },
];

export default function Achievements() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-3xl font-bold text-white">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className={`p-6 rounded-lg ${ach.unlocked ? 'bg-white/10' : 'bg-white/5 opacity-50'}`}>
            <div className="flex items-center gap-4 mb-2">
              <div className={ach.unlocked ? 'text-yellow-400' : 'text-gray-500'}>{ach.icon}</div>
              <div>
                <h3 className="font-bold text-white">{ach.name}</h3>
                {!ach.unlocked && <Lock size={14} className="inline text-gray-500" />}
              </div>
            </div>
            <p className="text-sm opacity-70">{ach.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
