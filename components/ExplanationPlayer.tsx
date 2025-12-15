import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { generateExplanationAudio } from '../services/gemini';

interface ExplanationPlayerProps {
  text: string;
  onComplete: () => void;
}

export const ExplanationPlayer: React.FC<ExplanationPlayerProps> = ({ text, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const loadAudio = async () => {
      setLoading(true);
      const buffer = await generateExplanationAudio(text);
      if (buffer) {
        audioBufferRef.current = buffer;
        setLoading(false);
        // Auto play when ready
        playAudio(buffer);
      } else {
        // Fallback if audio fails
        setLoading(false);
        setTimeout(onComplete, 5000); 
      }
    };

    loadAudio();

    return () => {
      stopAudio();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const playAudio = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Stop any existing
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        // Give user a moment to read final text before enabling continue or auto-continuing
    };

    source.start();
    startTimeRef.current = audioContextRef.current.currentTime;
    sourceNodeRef.current = source;
    setIsPlaying(true);
    
    // Animation loop for progress bar
    const updateProgress = () => {
        if (!audioContextRef.current) return;
        const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
        const duration = buffer.duration;
        const p = Math.min((elapsed / duration) * 100, 100);
        setProgress(p);
        
        if (p < 100 && isPlaying) {
            rafRef.current = requestAnimationFrame(updateProgress);
        }
    };
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
        sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleReplay = () => {
      if (audioBufferRef.current) {
          playAudio(audioBufferRef.current);
      }
  };

  return (
    <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative aspect-video group">
      {/* Background visual loop (Nature) */}
      <video 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4"
        autoPlay 
        loop 
        muted 
        playsInline 
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="mb-8 transform transition-all duration-500 translate-y-0">
             <h3 className="text-green-400 font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2">
                <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
                AI Explanation
             </h3>
             <p className="text-xl md:text-3xl text-white font-serif leading-relaxed drop-shadow-md">
                {text}
             </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 text-white">
            <button 
                onClick={handleReplay}
                disabled={loading}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-colors"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <RotateCcw size={24} />
                )}
            </button>
            
            {/* Progress Bar */}
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-green-500 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            <button 
                onClick={onComplete}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-colors ml-4"
            >
                Continue
            </button>
        </div>
      </div>
    </div>
  );
};
