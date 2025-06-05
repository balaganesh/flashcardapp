
import React from 'react';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  // API Key input is handled by environment variables as per Gemini guidelines.
  // This screen is simplified.

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-sky-400">Settings</h2>
        <Button onClick={onBack} variant="secondary">Back to Menu</Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-sky-300 mb-2">LLM Configuration</h3>
          <p className="text-slate-400">
            This application uses the Google Gemini API for AI-powered features.
          </p>
          {geminiService.isConfigured() ? (
             <p className="text-green-400 mt-2 bg-green-900/30 p-3 rounded-md">
                <CheckCircleIcon className="inline w-5 h-5 mr-1" />
                Gemini API is configured and ready.
             </p>
          ) : (
            <p className="text-yellow-400 mt-2 bg-yellow-900/30 p-3 rounded-md">
                <ExclamationTriangleIcon className="inline w-5 h-5 mr-1" />
                Gemini API key (process.env.API_KEY) is not detected. AI features will be disabled.
            </p>
          )}
          <p className="text-sm text-slate-500 mt-3">
            The API key should be set as an environment variable named <code>API_KEY</code>. 
            There is no UI to input the API key in this application.
          </p>
        </div>

        <hr className="border-slate-700" />

        <div>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">Future Settings</h3>
            <p className="text-slate-400">
                More customization options might be added here in the future, such as:
            </p>
            <ul className="list-disc list-inside text-slate-400 mt-2 pl-4 space-y-1">
                <li>Default timer duration for Multiple Card Mode.</li>
                <li>Appearance themes.</li>
                <li>Sound effects preferences.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


export default SettingsScreen;
    