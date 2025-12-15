import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence the text animations
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center text-white">
      {/* Background Starfield effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=2940&auto=format&fit=crop')] bg-cover opacity-50"></div>

      {/* 3D Globe Representation */}
      <div className={`relative z-10 transition-all duration-1000 ${step >= 2 ? 'scale-75 -translate-y-20' : 'scale-100'}`}>
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full shadow-[0_0_50px_rgba(50,255,100,0.5)] overflow-hidden relative animate-float">
          {/* Earth Texture Simulation */}
          <div 
            className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Earthmap1000x500.jpg/1000px-Earthmap1000x500.jpg')] bg-cover earth-spin"
            style={{ backgroundSize: '200% 100%' }}
          ></div>
          {/* Atmosphere glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_50px_rgba(0,0,0,0.6)]"></div>
        </div>
      </div>

      <div className="absolute bottom-20 md:bottom-32 z-20 text-center px-4 max-w-2xl">
        <h2 
          className={`text-xl md:text-2xl text-green-400 mb-4 transition-opacity duration-1000 title-font ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
        >
          Learning Solutions & Services Department
        </h2>
        
        <h1 
          className={`text-3xl md:text-5xl font-bold mb-8 transition-opacity duration-1000 delay-500 title-font ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
        >
          Guardians of Biodiversity
        </h1>

        {step >= 2 && (
          <div className="animate-fade-in-up">
            <p className="text-lg text-gray-200 mb-8 italic">
              "Biodiversity is the variety of life on Earth"
            </p>
            <button 
              onClick={onComplete}
              className="group bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full text-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg shadow-green-900/50"
            >
              Start Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
