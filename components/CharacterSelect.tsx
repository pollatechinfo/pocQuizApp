import React from 'react';
import { Player } from '../types';

interface CharacterSelectProps {
  onSelect: (player: Player) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  return (
    <div className="w-full h-screen bg-[url('https://images.unsplash.com/photo-1596323677420-53472d061595?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="z-10 text-center animate-fade-in">
        <h2 className="text-4xl md:text-6xl text-white font-bold mb-12 title-font text-shadow-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Please Select Your Player
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          {/* Male Avatar */}
          <button 
            onClick={() => onSelect({ avatar: 'boy', name: 'Adventurer' })}
            className="group relative flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="w-48 h-48 rounded-full border-4 border-white/30 group-hover:border-green-400 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden shadow-2xl transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Boy" className="w-full h-full object-cover" />
            </div>
            <span className="mt-4 text-2xl text-white font-bold group-hover:text-green-400 transition-colors">Explorer</span>
          </button>

          {/* Female Avatar */}
          <button 
             onClick={() => onSelect({ avatar: 'girl', name: 'Adventurer' })}
             className="group relative flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="w-48 h-48 rounded-full border-4 border-white/30 group-hover:border-pink-400 bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden shadow-2xl transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Girl" className="w-full h-full object-cover" />
            </div>
            <span className="mt-4 text-2xl text-white font-bold group-hover:text-pink-400 transition-colors">Guardian</span>
          </button>
        </div>
      </div>
    </div>
  );
};
