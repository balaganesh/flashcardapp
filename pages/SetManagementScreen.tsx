
import React, { useState, useEffect } from 'react';
import { FlashcardSet, Flashcard } from '../types';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { Modal } from '../components/Modal';
import { geminiService } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface SetManagementScreenProps {
  sets: FlashcardSet[];
  onUpdateSets: (sets: FlashcardSet[]) => void;
  onBack: () => void;
}

type ModalType = 'create' | 'edit' | 'aiGenerate' | 'deleteConfirm' | null;

const SetManagementScreen: React.FC<SetManagementScreenProps> = ({ sets, onUpdateSets, onBack }) => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [setName, setSetName] = useState('');
  const [cards, setCards] = useState<Array<Partial<Flashcard> & { tempId: string }>>([]);
  
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumCards, setAiNumCards] = useState<number>(10);
  const [aiGeneratedCards, setAiGeneratedCards] = useState<Flashcard[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null);


  useEffect(() => {
    if (currentModal === 'edit' && editingSet) {
      setSetName(editingSet.name);
      setCards(editingSet.cards.map(c => ({ ...c, tempId: c.id })));
    } else if (currentModal === 'create') {
      setSetName('');
      setCards([{ tempId: `card-${Date.now()}`, question: '', answer: '' }]);
    } else if (currentModal === 'aiGenerate') {
        setAiTopic('');
        setAiNumCards(10);
        setAiGeneratedCards([]);
        setAiError(null);
    }
  }, [currentModal, editingSet]);

  const handleAddCardField = () => {
    setCards([...cards, { tempId: `card-${Date.now()}-${cards.length}`, question: '', answer: '' }]);
  };

  const handleCardChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleRemoveCardField = (tempId: string) => {
    setCards(cards.filter(c => c.tempId !== tempId));
  };

  const validateCards = (): boolean => {
    if (!setName.trim()) {
      alert("Set name cannot be empty.");
      return false;
    }
    if (cards.length === 0) {
      alert("Set must have at least one card.");
      return false;
    }
    for (const card of cards) {
      if (!card.question?.trim() || !card.answer?.trim()) {
        alert("All card questions and answers must be filled.");
        return false;
      }
    }
    return true;
  };

  const handleSaveSet = () => {
    if (!validateCards()) return;

    const finalCards: Flashcard[] = cards.map((c, index) => ({
      id: c.id || `${Date.now()}-${index}`, // Use existing ID or generate new
      question: c.question!,
      answer: c.answer!,
    }));

    let updatedSets;
    if (editingSet) {
      const setToUpdate = { ...editingSet, name: setName, cards: finalCards };
      updatedSets = sets.map(s => s.id === editingSet.id ? setToUpdate : s);
    } else {
      const newSet: FlashcardSet = { id: `set-${Date.now()}`, name: setName, cards: finalCards };
      updatedSets = [...sets, newSet];
    }
    onUpdateSets(updatedSets);
    setCurrentModal(null);
    setEditingSet(null);
  };
  
  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim() || aiNumCards <= 0) {
      setAiError("Please provide a topic and a valid number of cards.");
      return;
    }
    if (!geminiService.isConfigured()) {
      setAiError("AI service is not configured. Please check API key setup.");
      return;
    }
    setIsLoadingAi(true);
    setAiError(null);
    setAiGeneratedCards([]);
    try {
      const generated = await geminiService.generateFlashcards(aiTopic, aiNumCards);
      setAiGeneratedCards(generated);
      setCards(generated.map(c => ({ ...c, tempId: c.id }))); // Pre-fill for potential editing
      setSetName(aiTopic); // Pre-fill set name
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "An unknown AI error occurred.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveAiGeneratedSet = () => {
    if (aiGeneratedCards.length === 0) {
        setAiError("No cards were generated or an error occurred.");
        return;
    }
    if (!setName.trim()) {
        setAiError("Please provide a name for this generated set.");
        return;
    }
    // Use the cards from the review/edit state, which might have been modified
    const finalCards: Flashcard[] = cards
        .filter(c => c.question?.trim() && c.answer?.trim()) // Ensure cards are valid
        .map((c, index) => ({
            id: c.id || `ai-${Date.now()}-${index}`,
            question: c.question!,
            answer: c.answer!,
    }));

    if (finalCards.length === 0) {
        setAiError("No valid cards to save. Please ensure questions and answers are filled.");
        return;
    }

    const newSet: FlashcardSet = { id: `set-${Date.now()}`, name: setName, cards: finalCards };
    onUpdateSets([...sets, newSet]);
    setCurrentModal(null);
    setAiGeneratedCards([]);
  };
  
  const openDeleteConfirmModal = (set: FlashcardSet) => {
    setSetToDelete(set);
    setCurrentModal('deleteConfirm');
  };

  const handleDeleteSet = () => {
    if (setToDelete) {
      onUpdateSets(sets.filter(s => s.id !== setToDelete.id));
      setCurrentModal(null);
      setSetToDelete(null);
    }
  };

  const renderCardFields = (editableCards: Array<Partial<Flashcard> & { tempId: string }>) => (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
      {editableCards.map((card, index) => (
        <div key={card.tempId} className="p-3 bg-slate-700 rounded-md border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-sky-400">Card {index + 1}</p>
            {editableCards.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => handleRemoveCardField(card.tempId)}>
                Remove
              </Button>
            )}
          </div>
          <TextArea
            label="Question"
            value={card.question || ''}
            onChange={(e) => handleCardChange(index, 'question', e.target.value)}
            placeholder="Enter question"
            rows={2}
          />
          <TextArea
            label="Answer"
            className="mt-2"
            value={card.answer || ''}
            onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
            placeholder="Enter answer"
            rows={2}
          />
        </div>
      ))}
      <Button variant="secondary" onClick={handleAddCardField} className="mt-4">Add Card</Button>
    </div>
  );


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-sky-400">Manage Card Sets</h2>
        <Button onClick={onBack} variant="secondary">Back to Menu</Button>
      </div>

      <div className="mb-6 space-x-3">
        <Button onClick={() => setCurrentModal('create')}>Create New Set</Button>
        <Button onClick={() => setCurrentModal('aiGenerate')} disabled={!geminiService.isConfigured()} variant="warning">
          Generate Set with AI {!geminiService.isConfigured() && "(Disabled)"}
        </Button>
      </div>
      
      {!geminiService.isConfigured() && (
        <p className="text-yellow-400 bg-yellow-900/30 p-3 rounded-md mb-4">
          AI Set Generation is disabled. API Key for Gemini not found.
        </p>
      )}

      {sets.length === 0 ? (
        <p className="text-slate-400 text-center py-10 text-lg">No flashcard sets yet. Create one or generate with AI!</p>
      ) : (
        <ul className="space-y-3">
          {sets.map((set) => (
            <li key={set.id} className="bg-slate-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-sky-300">{set.name}</h3>
                <p className="text-sm text-slate-400">{set.cards.length} cards</p>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="secondary" onClick={() => { setEditingSet(set); setCurrentModal('edit'); }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => openDeleteConfirmModal(set)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={currentModal === 'create' || currentModal === 'edit'} onClose={() => { setCurrentModal(null); setEditingSet(null);}} title={editingSet ? 'Edit Set' : 'Create New Set'} size="lg">
        <div className="space-y-4">
          <Input label="Set Name" value={setName} onChange={(e) => setSetName(e.target.value)} placeholder="e.g., World Capitals" />
          {renderCardFields(cards)}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => { setCurrentModal(null); setEditingSet(null);}}>Cancel</Button>
            <Button onClick={handleSaveSet}>Save Set</Button>
          </div>
        </div>
      </Modal>

      {/* AI Generate Modal */}
      <Modal isOpen={currentModal === 'aiGenerate'} onClose={() => setCurrentModal(null)} title="Generate Set with AI" size="lg">
        <div className="space-y-4">
          <Input label="Topic / Subject" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g., Basic Python Functions" />
          <Input label="Number of Cards" type="number" value={aiNumCards} onChange={(e) => setAiNumCards(parseInt(e.target.value, 10))} min="1" max="50" />
          
          {isLoadingAi && <div className="py-10"><LoadingSpinner text="Generating cards with AI..." /></div>}
          {aiError && <p className="text-red-400 bg-red-900/30 p-3 rounded-md">{aiError}</p>}
          
          {aiGeneratedCards.length > 0 && !isLoadingAi && (
            <>
              <h4 className="text-lg font-semibold text-sky-300 mt-4">Generated Cards (Editable):</h4>
              <Input label="Set Name (from Topic)" value={setName} onChange={(e) => setSetName(e.target.value)} placeholder="Name for this generated set" className="mb-3"/>
              {renderCardFields(cards)}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setCurrentModal(null)}>Cancel</Button>
            {aiGeneratedCards.length > 0 && !isLoadingAi ? (
              <Button onClick={handleSaveAiGeneratedSet} variant="success">Save Generated Set</Button>
            ) : (
              <Button onClick={handleGenerateWithAi} disabled={isLoadingAi}>
                {isLoadingAi ? 'Generating...' : 'Generate Cards'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={currentModal === 'deleteConfirm' && !!setToDelete} onClose={() => setCurrentModal(null)} title="Confirm Deletion" size="sm">
          <p className="text-slate-300 mb-6">Are you sure you want to delete the set "{setToDelete?.name}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setCurrentModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteSet}>Delete Set</Button>
          </div>
      </Modal>
    </div>
  );
};

export default SetManagementScreen;
    