
import React from 'react';

interface HeaderProps {
  userName: string | null;
  onNavigate: (view: any) => void; // Use specific enum type if App.tsx exports it
}

export const Header: React.FC<HeaderProps> = ({ userName, onNavigate }) => {
  // This component is simplified as navigation is handled in App.tsx currently.
  // It primarily shows the app title and welcome message.
  return (
    <header className="bg-slate-800 shadow-md p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sky-400">
          <button onClick={() => onNavigate('MainMenu')} className="hover:text-sky-300 transition-colors">
            Flashcard Master
          </button>
        </h1>
        {userName && (
          <div className="text-slate-300">
            Welcome, <span className="font-semibold text-sky-400">{userName}</span>!
          </div>
        )}
      </div>
    </header>
  );
};
    