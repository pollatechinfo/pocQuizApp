import React, { useState, useEffect } from 'react';
import { Intro } from './components/Intro';
import { CharacterSelect } from './components/CharacterSelect';
import { MazeTransition } from './components/MazeTransition';
import { MapQuestion } from './components/MapQuestion';
import { ExplanationPlayer } from './components/ExplanationPlayer';
import { AppState, Player, Question } from './types';
import { generateQuestion } from './services/gemini';

// Initial Hardcoded Level to match the user's video request
const INITIAL_QUESTION: Question = {
  id: 'level-1',
  type: 'MAP',
  text: 'Where does Aramco protect biodiversity areas?',
  explanation: 'Aramco has designated 12 biodiversity protection areas that cover 985 km² of the kingdom and are managed to conserve areas of high biodiversity.',
  mapZones: [
    { id: 'z1', x: 75, y: 35, label: 'Manifa' },      // East coast approx
    { id: 'z2', x: 80, y: 70, label: 'Shaybah' },     // Empty Quarter
    { id: 'z3', x: 25, y: 75, label: 'Abha' },        // Southwest
    { id: 'z4', x: 45, y: 50, label: 'Mahazat' },     // Central
    { id: 'z5', x: 70, y: 25, label: 'Rahima Bay' },  // East coast north
  ],
  correctZoneIds: ['z1', 'z2', 'z3', 'z4', 'z5'], // In the video user selects 3, we accept any of these as valid "areas"
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<AppState>('INTRO');
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(INITIAL_QUESTION);
  const [score, setScore] = useState(0);

  // Preload next question if we are in quiz mode
  const loadNextQuestion = async () => {
    // Only generate new questions after level 1
    if (currentQuestion.id === 'level-1') {
        const nextQ = await generateQuestion();
        setCurrentQuestion(nextQ);
    } else {
        const nextQ = await generateQuestion();
        setCurrentQuestion(nextQ);
    }
  };

  const handleIntroComplete = () => setGameState('CHARACTER_SELECT');
  
  const handleCharacterSelect = (p: Player) => {
    setPlayer(p);
    setGameState('MAZE_TRANSITION');
  };

  const handleMazeComplete = () => setGameState('QUIZ');

  const handleQuizResult = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 10);
      loadNextQuestion(); // Load next for when we return to quiz
      // In a real game, maybe show a "Level Complete" screen, but here we loop
      // For this demo, if correct, we go to next question immediately
      loadNextQuestion().then(() => setGameState('QUIZ'));
    } else {
      setGameState('EXPLANATION');
    }
  };

  const handleExplanationComplete = async () => {
    // After explanation, move to next question
    await loadNextQuestion();
    setGameState('QUIZ');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'INTRO':
        return <Intro onComplete={handleIntroComplete} />;
      
      case 'CHARACTER_SELECT':
        return <CharacterSelect onSelect={handleCharacterSelect} />;
      
      case 'MAZE_TRANSITION':
        return player && <MazeTransition player={player} onComplete={handleMazeComplete} />;
      
      case 'QUIZ':
        if (currentQuestion.type === 'MAP') {
          return (
             <div className="w-full h-screen bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2940&auto=format&fit=crop')] bg-cover flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
               <div className="relative z-10 w-full h-full max-w-6xl max-h-[800px]">
                 <MapQuestion question={currentQuestion} onResult={handleQuizResult} />
               </div>
             </div>
          );
        }
        // Fallback for AI generated questions (Multiple Choice)
        return (
          <div className="w-full h-screen bg-green-50 flex items-center justify-center p-4">
             <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentQuestion.text}</h2>
                <div className="space-y-4">
                   {currentQuestion.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                           const isCorrect = idx === currentQuestion.correctOptionIndex;
                           handleQuizResult(isCorrect);
                        }}
                        className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all font-semibold text-gray-600"
                      >
                        {opt}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'EXPLANATION':
        return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4">
            <h2 className="text-white text-3xl font-bold mb-8 title-font">Guardian Knowledge</h2>
            <ExplanationPlayer 
              text={currentQuestion.explanation} 
              onComplete={handleExplanationComplete} 
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="w-full min-h-screen">
      {renderContent()}
    </main>
  );
};

export default App;
