import React, { useState, useRef } from 'react';
import { LogEntry, MealCategory, UserSettings, Unit, AIEstimate } from '../types';
import { getCaloriesFromText, getCaloriesFromImage } from '../services/geminiService';
import Modal from './common/Modal';
import { KCAL_TO_KJ } from '../constants';

interface LogEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: Omit<LogEntry, 'id' | 'date'>) => void;
  settings: UserSettings;
}

type InputMode = 'text' | 'photo' | null;
type View = 'selection' | 'form';

const LogEntryForm: React.FC<LogEntryFormProps> = ({ isOpen, onClose, onSave, settings }) => {
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [view, setView] = useState<View>('selection');
  
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<AIEstimate | null>(null);
  const [portionFactor, setPortionFactor] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetState = () => {
    setInputMode(null);
    setView('selection');
    setTextInput('');
    setImageFile(null);
    setImagePreview(null);
    setIsLoading(false);
    setError(null);
    setAiResult(null);
    setPortionFactor(1);
    setSelectedCategory(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleModeSelect = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'photo') {
      fileInputRef.current?.click();
    } else {
      setView('form');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setView('form');
    } else {
        resetState();
    }
  };

  const handleSubmit = async () => {
    if (!settings.sendDataToAI) {
        setError("AI Recognition is disabled in settings. Please enable it to log meals.");
        return;
    }
    
    if (!inputMode || (inputMode === 'text' && !textInput) || (inputMode === 'photo' && !imageFile)) {
      setError('Please provide a description or an image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAiResult(null);

    try {
      let result;
      if (inputMode === 'text') {
        result = await getCaloriesFromText(textInput);
      } else { // photo
        result = await getCaloriesFromImage(imageFile!);
      }
      setAiResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveLog = () => {
    if (!aiResult || !selectedCategory) return;
    onSave({
        name: aiResult.mealName,
        calories: aiResult.estimatedCalories,
        portionFactor,
        category: selectedCategory,
        source: inputMode!,
    });
    handleClose();
  }

  const displayValue = (kcal: number) => {
    const value = settings.unit === Unit.KJ ? kcal * KCAL_TO_KJ : kcal;
    return Math.round(value);
  };

  const renderSelectionView = () => (
    <div className="text-center space-y-4">
        <p className="text-slate-600 dark:text-slate-300">How would you like to log your meal?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => handleModeSelect('text')} className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Describe Meal</span>
            </button>
            <button onClick={() => handleModeSelect('photo')} className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Use Photo</span>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
    </div>
  );

  const renderFormView = () => (
    <div className="space-y-4">
      {inputMode === 'text' && (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="e.g., 'A bowl of oatmeal with berries and nuts'"
          className="w-full p-3 h-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
          rows={3}
        />
      )}
      {inputMode === 'photo' && imagePreview && (
        <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-700">
          <img src={imagePreview} alt="Meal preview" className="w-full h-full object-cover" />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Estimating...' : 'Estimate Calories'}
      </button>
    </div>
  );

  const renderResultView = () => (
    aiResult && (
      <div className="space-y-6">
        <div className="text-center bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">AI Estimate</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{aiResult.mealName}</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{displayValue(aiResult.estimatedCalories * portionFactor)} {settings.unit}</p>
        </div>

        <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">AI's Breakdown:</h4>
            <ul className="text-sm bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg divide-y divide-slate-200 dark:divide-slate-600">
                {aiResult.breakdown.map((item, index) => (
                    <li key={index} className="flex justify-between items-center py-1.5">
                        <span className="text-slate-600 dark:text-slate-300">
                            {item.itemName} <span className="text-slate-500 dark:text-slate-400">({item.quantity})</span>
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{displayValue(item.calories)} {settings.unit}</span>
                    </li>
                ))}
            </ul>
            <p className="text-xs text-center text-slate-400 dark:text-slate-500">Is this accurate? Adjust the portion slider below.</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adjust Portion Size</label>
            <div className="flex items-center gap-4">
                <span className="text-lg">🍽️</span>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={portionFactor}
                    onChange={(e) => setPortionFactor(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                />
                <span className="text-3xl">🍽️</span>
            </div>
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                {Math.round(portionFactor * 100)}% of estimate
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Assign to Meal</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(MealCategory).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
            onClick={handleSaveLog}
            disabled={!selectedCategory}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          Save Log
        </button>
      </div>
    )
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={aiResult ? "Confirm Your Meal" : "Log a New Meal"}>
      {view === 'selection' && !aiResult && renderSelectionView()}
      {view === 'form' && !aiResult && !isLoading && renderFormView()}
      {isLoading && <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Our AI is analyzing your meal...</p>
      </div>}
      {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={resetState} className="mt-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">Try Again</button>
      </div>}
      {aiResult && renderResultView()}
    </Modal>
  );
};

export default LogEntryForm;
