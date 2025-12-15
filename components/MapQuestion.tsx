import React, { useState } from 'react';
import { Question, DropZone } from '../types';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

interface MapQuestionProps {
  question: Question;
  onResult: (correct: boolean) => void;
}

export const MapQuestion: React.FC<MapQuestionProps> = ({ question, onResult }) => {
  const [placedPins, setPlacedPins] = useState<Record<string, boolean>>({}); // zoneId -> hasPin
  const [draggedPin, setDraggedPin] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');

  const zones = question.mapZones || [];
  const requiredPins = 3;
  const currentPlacedCount = Object.keys(placedPins).length;

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedPin(true);
    e.dataTransfer.setData('text/plain', 'pin');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setDraggedPin(false);
    
    if (placedPins[zoneId]) return;

    setPlacedPins(prev => ({
      ...prev,
      [zoneId]: true
    }));
  };

  const handleSubmit = () => {
    const placedZoneIds = Object.keys(placedPins);
    const correctZoneIds = question.correctZoneIds || [];
    
    // Check if at least required number of correct zones are selected
    const correctCount = placedZoneIds.filter(id => correctZoneIds.includes(id)).length;
    
    if (correctCount >= requiredPins) {
      setFeedback('CORRECT');
      setTimeout(() => onResult(true), 1500);
    } else {
      setFeedback('INCORRECT');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-green-50 p-4 rounded-xl shadow-inner relative">
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 text-center title-font">
        {question.text}
      </h2>

      <div className="flex-1 w-full max-w-4xl relative flex flex-col md:flex-row gap-8">
        
        {/* Map Area */}
        <div className="relative flex-grow bg-blue-100 rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-[4/3] md:aspect-auto">
          {/* SVG Map of Saudi Arabia (simplified representation) */}
          <svg viewBox="0 0 500 400" className="w-full h-full bg-[#aaddff]">
             {/* Land Mass */}
             <path 
               d="M 150 50 L 250 30 L 350 50 L 400 100 L 420 200 L 400 300 L 300 350 L 150 320 L 100 200 L 120 100 Z" 
               fill="#e6d5b8" 
               stroke="#d4c5a9" 
               strokeWidth="2"
             />
             {/* Internal details decor */}
             <path d="M 200 150 Q 250 200 300 150" fill="none" stroke="#d4c5a9" strokeWidth="2" opacity="0.5"/>
          </svg>

          {/* Drop Zones */}
          {zones.map((zone) => (
            <div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
              className={`absolute w-12 h-12 -ml-6 -mt-12 transition-all duration-300 flex flex-col items-center group
                ${placedPins[zone.id] ? 'opacity-100' : 'opacity-50 hover:opacity-80'}
              `}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            >
              {placedPins[zone.id] ? (
                 <div className="text-red-600 drop-shadow-md animate-bounce">
                    <MapPin fill="currentColor" size={40} />
                 </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-red-400 bg-red-400/20 group-hover:bg-red-400/40" />
              )}
              <span className="text-xs font-bold text-gray-700 bg-white/80 px-1 rounded mt-1 whitespace-nowrap">
                {zone.label}
              </span>
            </div>
          ))}
        </div>

        {/* Sidebar Controls */}
        <div className="w-full md:w-64 flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-green-100">
          <div className="mb-8 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Instructions</h3>
            <p className="text-sm text-gray-500">
              Drag the pin onto the map to identify <span className="font-bold text-green-600">{requiredPins}</span> protected biodiversity areas.
            </p>
          </div>

          {/* Draggable Source */}
          <div 
            draggable 
            onDragStart={handleDragStart}
            className={`cursor-grab active:cursor-grabbing p-4 bg-green-50 rounded-full hover:bg-green-100 transition-colors mb-8 ${currentPlacedCount >= zones.length ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <MapPin size={48} className="text-red-600" fill="currentColor" />
          </div>

          <div className="mt-auto w-full">
            <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
              <span>Progress</span>
              <span>{currentPlacedCount}/{requiredPins}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
               <div 
                 className="h-full bg-green-500 transition-all duration-500"
                 style={{ width: `${Math.min((currentPlacedCount / requiredPins) * 100, 100)}%` }}
               />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPlacedCount === 0}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>

      {/* Incorrect Feedback Modal */}
      {feedback === 'INCORRECT' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center transform scale-100 animate-pop-in border-4 border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Incorrect</h3>
            <p className="text-gray-500 mb-6">You did not select the correct locations.</p>
            <button 
              onClick={() => onResult(false)}
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
            >
              See Explanation
            </button>
          </div>
        </div>
      )}

      {/* Correct Feedback Overlay */}
       {feedback === 'CORRECT' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-500/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold text-green-700">Excellent!</h3>
          </div>
        </div>
      )}
    </div>
  );
};
