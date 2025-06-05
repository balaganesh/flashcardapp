
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface WelcomeScreenProps {
  onNameSet: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNameSet }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSet(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
        {/* <img src="https://picsum.photos/seed/flashcardwelcome/150/150" alt="Flashcard Master Logo" className="mx-auto mb-6 rounded-full shadow-lg" /> */}
        <h1 className="text-4xl font-bold text-sky-400 mb-6 mt-4">Welcome to Flashcard Master!</h1>
        <p className="text-slate-300 mb-8 text-lg">Let's get started on your learning journey. Please enter your name:</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Your Name"
            className="text-center text-lg"
          />
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Let's Go!
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
