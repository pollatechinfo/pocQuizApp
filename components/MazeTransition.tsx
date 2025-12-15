import React, { useEffect } from 'react';
import { Player } from '../types';

interface MazeTransitionProps {
  player: Player;
  onComplete: () => void;
}

export const MazeTransition: React.FC<MazeTransitionProps> = ({ player, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-screen bg-green-900 relative overflow-hidden flex items-center justify-center">
      {/* Maze Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="z-10 text-center text-white px-6">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-dashed border-green-300 rounded-full animate-spin-slow"></div>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatar === 'boy' ? 'Felix' : 'Aneka'}`} 
            alt="Player" 
            className="w-full h-full rounded-full p-2 bg-green-800"
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 animate-pulse">Entering the Biodiversity Zone...</h2>
        <p className="text-green-200">Get ready to protect the environment!</p>
      </div>

      {/* Decorative Leaves */}
      <img src="https://img.icons8.com/color/96/leaf.png" className="absolute top-10 left-10 animate-bounce w-16 h-16 opacity-50" alt="" />
      <img src="https://img.icons8.com/color/96/leaf.png" className="absolute bottom-10 right-10 animate-bounce delay-700 w-20 h-20 opacity-50 rotate-90" alt="" />
    </div>
  );
};
