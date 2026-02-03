import { useGameStore } from '../stores/gameStore';

export default function Game() {
  const { addScore } = useGameStore();
  
  return (
    <div className="game">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Play Now</h1>
        <p className="text-white/70">Your game will appear here</p>
      </div>
      {/* The actual game component from the original App */}
      <div id="game-container">
        {/* Game content rendered via main App component */}
      </div>
    </div>
  );
}
