
import React, { useState, useEffect, useCallback } from 'react';
import { FlashcardSet, StudyView, Flashcard } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import WelcomeScreen from './pages/WelcomeScreen';
import MainMenuScreen from './pages/MainMenuScreen';
import SetManagementScreen from './pages/SetManagementScreen';
import SingleCardStudyScreen from './pages/SingleCardStudyScreen';
import MultipleCardMatchScreen from './pages/MultipleCardMatchScreen';
import SettingsScreen from './pages/SettingsScreen'; // Simplified

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<StudyView>(StudyView.Welcome);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);

  useEffect(() => {
    const storedName = storageService.getUserName();
    const storedSets = storageService.getFlashcardSets();
    if (storedName) {
      setUserName(storedName);
      setCurrentView(StudyView.MainMenu);
    }
    setFlashcardSets(storedSets);
  }, []);

  const handleNameSet = (name: string) => {
    storageService.setUserName(name);
    setUserName(name);
    setCurrentView(StudyView.MainMenu);
  };

  const navigateTo = (view: StudyView) => {
    setCurrentView(view);
  };

  const handleSelectSet = (set: FlashcardSet) => {
    setSelectedSet(set);
  };
  
  const handleUpdateSets = useCallback((updatedSets: FlashcardSet[]) => {
    setFlashcardSets(updatedSets);
    storageService.saveFlashcardSets(updatedSets);
  }, []);


  const renderView = () => {
    switch (currentView) {
      case StudyView.Welcome:
        return <WelcomeScreen onNameSet={handleNameSet} />;
      case StudyView.MainMenu:
        return (
          <MainMenuScreen
            onNavigate={navigateTo}
            sets={flashcardSets}
            onSelectSet={(set) => {
              handleSelectSet(set);
              // Determine next view based on where user wants to go with the set
              // For now, assume navigating to SetManagement if selected from main menu for general purpose
              // Actual study mode selection will happen within MainMenuScreen options
            }}
          />
        );
      case StudyView.SetManagement:
        return (
          <SetManagementScreen
            sets={flashcardSets}
            onUpdateSets={handleUpdateSets}
            onBack={() => navigateTo(StudyView.MainMenu)}
          />
        );
      case StudyView.SingleCardStudy:
        if (!selectedSet) {
          navigateTo(StudyView.MainMenu); // Should not happen if flow is correct
          return <p>No set selected. Redirecting...</p>;
        }
        return <SingleCardStudyScreen flashcardSet={selectedSet} onFinish={() => { setSelectedSet(null); navigateTo(StudyView.MainMenu);}} />;
      case StudyView.MultipleCardMatch:
        if (!selectedSet) {
          navigateTo(StudyView.MainMenu); // Should not happen
          return <p>No set selected. Redirecting...</p>;
        }
        return <MultipleCardMatchScreen flashcardSet={selectedSet} onFinish={() => { setSelectedSet(null); navigateTo(StudyView.MainMenu);}} />;
      case StudyView.Settings:
        return <SettingsScreen onBack={() => navigateTo(StudyView.MainMenu)} />;
      default:
        return <WelcomeScreen onNameSet={handleNameSet} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentView !== StudyView.Welcome && <Header userName={userName} onNavigate={(viewName) => navigateTo(StudyView[viewName as keyof typeof StudyView] || StudyView.MainMenu)} />}
      <main className="container mx-auto p-4 flex-grow">
        {renderView()}
      </main>
      <footer className="bg-slate-800 text-center text-sm text-slate-400 p-4 mt-auto">
        Flashcard Master &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
    