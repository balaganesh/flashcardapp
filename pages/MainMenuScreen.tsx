
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { StudyView, FlashcardSet } from '../types';
import { Modal } from '../components/Modal';

interface MainMenuScreenProps {
  onNavigate: (view: StudyView) => void;
  sets: FlashcardSet[];
  onSelectSet: (set: FlashcardSet) => void;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onNavigate, sets, onSelectSet }) => {
  const [isSetSelectionModalOpen, setIsSetSelectionModalOpen] = useState(false);
  const [studyModeToStart, setStudyModeToStart] = useState<StudyView | null>(null);

  const openSetSelectionModal = (mode: StudyView) => {
    if (sets.length === 0) {
      alert("No flashcard sets available. Please create or generate a set first in 'Manage Card Sets'.");
      return;
    }
    setStudyModeToStart(mode);
    setIsSetSelectionModalOpen(true);
  };

  const handleSetSelectedForStudy = (set: FlashcardSet) => {
    onSelectSet(set);
    if (studyModeToStart) {
      onNavigate(studyModeToStart);
    }
    setIsSetSelectionModalOpen(false);
    setStudyModeToStart(null);
  };
  
  const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }> = ({ icon, label, onClick, disabled }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="flex flex-col items-center justify-center bg-slate-700 hover:bg-sky-700 transition-all duration-200 p-6 rounded-lg shadow-lg w-full aspect-square text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      <div className="mb-3 text-sky-400">{icon}</div>
      <span className="text-lg font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold text-sky-400 mb-12">Main Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        <ActionButton 
          icon={<StudyIcon />} 
          label="Single Card Study"
          onClick={() => openSetSelectionModal(StudyView.SingleCardStudy)}
          disabled={sets.length === 0}
        />
        <ActionButton 
          icon={<MatchIcon />} 
          label="Multiple Card Match"
          onClick={() => openSetSelectionModal(StudyView.MultipleCardMatch)}
          disabled={sets.length === 0}
        />
        <ActionButton 
          icon={<ManageIcon />} 
          label="Manage Card Sets"
          onClick={() => onNavigate(StudyView.SetManagement)}
        />
        <ActionButton 
          icon={<SettingsIcon />} 
          label="Settings"
          onClick={() => onNavigate(StudyView.Settings)}
          />
      </div>
      {sets.length === 0 && (
        <p className="mt-8 text-yellow-400 bg-yellow-900/50 p-3 rounded-md">
          You don't have any flashcard sets yet. Go to "Manage Card Sets" to create your first one!
        </p>
      )}

      <Modal
        isOpen={isSetSelectionModalOpen}
        onClose={() => setIsSetSelectionModalOpen(false)}
        title="Select a Set to Study"
        size="md"
      >
        {sets.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {sets.map((set) => (
              <li key={set.id}>
                <Button
                  variant="secondary"
                  className="w-full text-left justify-start py-3"
                  onClick={() => handleSetSelectedForStudy(set)}
                >
                  {set.name} ({set.cards.length} cards)
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300">No sets available. Please create a set first.</p>
        )}
      </Modal>
    </div>
  );
};

// SVG Icons (Heroicons)
const StudyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const MatchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>;
const ManageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125A2.25 2.25 0 014.5 4.875h15A2.25 2.25 0 0121.75 7.125v10.5A2.25 2.25 0 0119.5 20.125h-15A2.25 2.25 0 012.25 17.625V7.125z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75A2.25 2.25 0 0112 1.5h.008A2.25 2.25 0 0114.25 3.75v.443c.08.03.158.061.234.094a2.25 2.25 0 011.986 2.283V8.25a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V6.57c0-1.092.79-2.006 1.848-2.225.081-.024.16-.049.237-.076v-.443zM10.5 9.75h3" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.225 1.15-.242 1.723-.047l.564.197a2.25 2.25 0 011.17.772l.533.788c.417.615.625 1.314.625 2.027v.456c0 .306.034.607.099.9a2.25 2.25 0 01-1.36 2.088l-.533.266c-.645.323-1.35.398-2.02.207l-.58-.17c-.678-.2-1.252-.623-1.62-1.143l-.475-.676a2.25 2.25 0 01-.114-2.652l.3-.443c.37-.544.423-1.236.137-1.836M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>;


export default MainMenuScreen;
    