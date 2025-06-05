import React, { useState, useEffect, useCallback } from 'react';
import { FlashcardSet, StudyCard } from '../types';
import { Button } from '../components/Button';
import { shuffleArray } from '../utils/arrayUtils';

interface SingleCardStudyScreenProps {
  flashcardSet: FlashcardSet;
  onFinish: () => void;
}

const SingleCardStudyScreen: React.FC<SingleCardStudyScreenProps> = ({ flashcardSet, onFinish }) => {
  const [studyDeck, setStudyDeck] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [toRepeat, setToRepeat] = useState<StudyCard[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [displayFrontAsQuestion, setDisplayFrontAsQuestion] = useState<boolean>(true); // true: Question on front, false: Answer on front
  const [sessionFinished, setSessionFinished] = useState(false);

  const initializeDeck = useCallback(() => {
    const initialDeck = shuffleArray(flashcardSet.cards.map(card => ({ ...card, status: 'unseen' } as StudyCard)));
    setStudyDeck(initialDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setToRepeat([]);
    setMasteredCount(0);
    setSessionFinished(false);
    // displayFrontAsQuestion will be set by the useEffect hook depending on currentIndex and studyDeck
  }, [flashcardSet]);

  useEffect(() => {
    initializeDeck();
  }, [initializeDeck]);
  
  // Effect to randomize card face when card changes and reset flip state
  useEffect(() => {
    if (studyDeck.length > 0 && studyDeck[currentIndex]) { // Check if current card exists
      setDisplayFrontAsQuestion(Math.random() < 0.5);
      setIsFlipped(false); // Always show the "front" of the new card first, unflipped
    }
  }, [currentIndex, studyDeck]); // Re-run when current card index or the deck itself changes


  const currentCard = studyDeck[currentIndex];

  const handleFlipCard = () => setIsFlipped(!isFlipped);

  const handleResponse = (isCorrect: boolean) => {
    setIsFlipped(false); // Reset flip state immediately for the upcoming card transition.

    let nextToRepeat = [...toRepeat];
    const cardBeingEvaluated = currentCard; // currentCard is the card we are *leaving*.
    
    if (isCorrect) {
      setMasteredCount(prev => prev + 1);
      if (cardBeingEvaluated) {
         cardBeingEvaluated.status = 'correct'; 
      }
    } else {
      if (cardBeingEvaluated) {
        cardBeingEvaluated.status = 'wrong'; 
        nextToRepeat.push(cardBeingEvaluated); 
      }
    }

    if (currentIndex < studyDeck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else { 
      // At the end of the current deck
      if (nextToRepeat.length > 0) {
        setStudyDeck(shuffleArray(nextToRepeat)); 
        setToRepeat([]); // Clear toRepeat as its contents are now shuffled into studyDeck
        setCurrentIndex(0);
      } else { 
        // No cards to repeat, and all current deck cards processed
        setSessionFinished(true);
      }
    }
  };

  if (sessionFinished) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-800 rounded-lg shadow-xl">
        <img src="https://picsum.photos/seed/congrats/120/120" alt="Congratulations" className="rounded-full mb-6" />
        <h2 className="text-3xl font-bold text-green-400 mb-4">Congratulations!</h2>
        <p className="text-xl text-slate-300 mb-6">You've mastered the "{flashcardSet.name}" set!</p>
        <div className="space-x-3">
            <Button onClick={initializeDeck} variant="secondary">Study Again</Button>
            <Button onClick={onFinish}>Back to Menu</Button>
        </div>
      </div>
    );
  }
  
  if (flashcardSet.cards.length === 0) {
      return <div className="text-center p-6">
          <p className="text-xl text-yellow-400">This set has no cards.</p>
          <Button onClick={onFinish} className="mt-4">Back to Menu</Button>
      </div>;
  }

  if (!currentCard) {
    // This state should ideally not be reached if initializeDeck works correctly and sets have cards.
    // Could indicate a brief moment during deck transitions.
    return <div className="text-center p-6"><LoadingSpinner text="Loading card..." /></div>;
  }
  
  const displayContent = displayFrontAsQuestion ? currentCard.question : currentCard.answer;
  const hiddenContent = displayFrontAsQuestion ? currentCard.answer : currentCard.question;


  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold text-sky-400 mb-2">Single Card Study: {flashcardSet.name}</h2>
      <p className="text-slate-400 mb-1">Cards Mastered: {masteredCount} / {flashcardSet.cards.length}</p>
      <p className="text-slate-400 mb-6">Cards in current round: {studyDeck.length - currentIndex} | To repeat later: {toRepeat.length}</p>
      
      <div 
        key={currentCard.id + (displayFrontAsQuestion ? '-q-front' : '-a-front')} // Ensure re-mount if card or its front face changes
        className={`card w-full max-w-lg h-64 md:h-80 perspective mb-6 cursor-pointer ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleFlipCard}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? `Showing ${displayFrontAsQuestion ? 'answer' : 'question'}. Click to show ${displayFrontAsQuestion ? 'question' : 'answer'}.` : `Showing ${displayFrontAsQuestion ? 'question' : 'answer'}. Click to show ${displayFrontAsQuestion ? 'answer' : 'question'}.`}
      >
        <div className="card-inner">
          <div className="card-front bg-sky-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-center text-xl md:text-2xl">
            <span className="font-semibold mr-2 text-sm absolute top-2 left-2 bg-black/20 px-2 py-1 rounded">
              {displayFrontAsQuestion ? 'Question:' : 'Answer:'}
            </span>
            {displayContent}
          </div>
          <div className="card-back bg-sky-700 text-white p-4 rounded-lg shadow-lg flex items-center justify-center text-xl md:text-2xl">
            <span className="font-semibold mr-2 text-sm absolute top-2 left-2 bg-black/20 px-2 py-1 rounded">
              {displayFrontAsQuestion ? 'Answer:' : 'Question:'}
            </span>
            {hiddenContent}
          </div>
        </div>
      </div>

      {!isFlipped ? (
        <Button onClick={handleFlipCard} size="lg" className="w-full max-w-lg">
          Show {displayFrontAsQuestion ? 'Answer' : 'Question'}
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <Button onClick={() => handleResponse(false)} variant="danger" size="lg">I Got It Wrong</Button>
          <Button onClick={() => handleResponse(true)} variant="success" size="lg">I Got It Right</Button>
        </div>
      )}
      <Button onClick={onFinish} variant="secondary" className="mt-8">End Study Session</Button>
    </div>
  );
};

// Minimal LoadingSpinner for the card loading case
const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
    <div className="flex flex-col items-center justify-center space-y-2 p-5">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
      {text && <p className="text-slate-300 mt-2">{text}</p>}
    </div>
  );

export default SingleCardStudyScreen;
