
import React, { useState, useEffect, useCallback } from 'react';
import { FlashcardSet, MatchCard } from '../types';
import { Button } from '../components/Button';
import { shuffleArray } from '../utils/arrayUtils';
import { useTimer } from '../hooks/useTimer';

interface MultipleCardMatchScreenProps {
  flashcardSet: FlashcardSet;
  onFinish: () => void;
}

const MultipleCardMatchScreen: React.FC<MultipleCardMatchScreenProps> = ({ flashcardSet, onFinish }) => {
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [gameOver, setGameOver] = useState<'win' | 'timeout' | null>(null);

  const calculateInitialTime = useCallback(() => {
     // 60 seconds per 5 pairs, minimum 30 seconds
    const numPairs = flashcardSet.cards.length;
    return Math.max(30, Math.floor(numPairs / 5) * 60);
  }, [flashcardSet.cards.length]);
  
  const { timeLeft, isRunning, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer({
    initialTime: calculateInitialTime(),
    onTimeout: () => setGameOver('timeout'),
    autoStart: false,
  });

  const initializeGame = useCallback(() => {
    const newMatchCards: MatchCard[] = [];
    flashcardSet.cards.forEach(card => {
      newMatchCards.push({ id: `${card.id}-q`, content: card.question, type: 'question', originalCardId: card.id, isMatched: false });
      newMatchCards.push({ id: `${card.id}-a`, content: card.answer, type: 'answer', originalCardId: card.id, isMatched: false });
    });
    setMatchCards(shuffleArray(newMatchCards));
    setSelectedCards([]);
    setMatchedPairsCount(0);
    setGameOver(null);
    resetTimer(calculateInitialTime());
    startTimer();
  }, [flashcardSet, resetTimer, startTimer, calculateInitialTime]);

  useEffect(() => {
    if(flashcardSet.cards.length > 0){
        initializeGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcardSet]); // Only re-initialize if the set itself changes, not initializeGame which has dependencies

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (first.originalCardId === second.originalCardId && first.type !== second.type) {
        // Match!
        setMatchCards(prev =>
          prev.map(mc =>
            mc.originalCardId === first.originalCardId ? { ...mc, isMatched: true } : mc
          )
        );
        setMatchedPairsCount(prev => prev + 1);
      }
      // Deselect after a short delay for user to see interaction
      setTimeout(() => setSelectedCards([]), 500);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (flashcardSet.cards.length > 0 && matchedPairsCount === flashcardSet.cards.length) {
      setGameOver('win');
      pauseTimer();
    }
  }, [matchedPairsCount, flashcardSet.cards.length, pauseTimer]);

  const handleCardClick = (card: MatchCard) => {
    if (gameOver || card.isMatched || selectedCards.length === 2 || selectedCards.find(sc => sc.id === card.id)) {
      return; // Prevent interaction if game over, card matched, 2 already selected, or card already selected
    }
    setSelectedCards(prev => [...prev, card]);
  };
  
  if (flashcardSet.cards.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-xl text-yellow-400">This set has no cards to play the match game.</p>
        <Button onClick={onFinish} className="mt-4">Back to Menu</Button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-800 rounded-lg shadow-xl">
        <img 
            src={gameOver === 'win' ? "https://picsum.photos/seed/matchwin/120/120" : "https://picsum.photos/seed/matchlose/120/120"} 
            alt={gameOver === 'win' ? "You Win!" : "Game Over"}
            className="rounded-full mb-6" 
        />
        <h2 className={`text-4xl font-bold mb-4 ${gameOver === 'win' ? 'text-green-400' : 'text-red-400'}`}>
          {gameOver === 'win' ? 'You Win!' : "Time's Up! Game Over."}
        </h2>
        {gameOver === 'win' && <p className="text-xl text-slate-300 mb-2">You matched all {flashcardSet.cards.length} pairs!</p>}
        <p className="text-lg text-slate-300 mb-6">Time remaining: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</p>
        <div className="space-x-3">
            <Button onClick={initializeGame} variant="secondary">Play Again</Button>
            <Button onClick={onFinish}>Back to Menu</Button>
        </div>
      </div>
    );
  }
  
  const getCardStyle = (card: MatchCard) => {
    let baseStyle = "p-3 rounded-lg shadow-md cursor-pointer transition-all duration-200 h-32 md:h-36 flex items-center justify-center text-center text-sm md:text-base break-words overflow-hidden";
    if (card.isMatched) {
      return `${baseStyle} bg-green-700 text-green-200 opacity-60 cursor-default`;
    }
    if (selectedCards.find(sc => sc.id === card.id)) {
      return `${baseStyle} bg-sky-500 text-white ring-2 ring-sky-300 transform scale-105`;
    }
    return `${baseStyle} bg-slate-700 hover:bg-slate-600 text-slate-200`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-sky-400 mb-2">Multiple Card Match: {flashcardSet.name}</h2>
      <div className="text-2xl font-mono text-yellow-400 mb-1">
        Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
      <p className="text-slate-400 mb-6">Matched Pairs: {matchedPairsCount} / {flashcardSet.cards.length}</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 w-full max-w-5xl">
        {matchCards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={getCardStyle(card)}
          >
            {card.content}
          </div>
        ))}
      </div>
      <Button onClick={onFinish} variant="secondary" className="mt-8">End Game</Button>
    </div>
  );
};

export default MultipleCardMatchScreen;
    