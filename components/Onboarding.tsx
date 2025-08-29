
import React, { useState } from 'react';
import { UserSettings, Unit } from '../types';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [unit, setUnit] = useState<Unit>(Unit.Kcal);
  const [sendDataToAI, setSendDataToAI] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ dailyGoal, unit, sendDataToAI });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome to QuickCalorie</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Let's get you set up in seconds.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dailyGoal" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Daily Goal
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="dailyGoal"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value, 10) || 0)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                placeholder="2000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 sm:text-sm">{unit}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Units</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUnit(Unit.Kcal)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${unit === Unit.Kcal ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                Calories (kcal)
              </button>
              <button
                type="button"
                onClick={() => setUnit(Unit.KJ)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${unit === Unit.KJ ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                Kilojoules (kJ)
              </button>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="sendDataToAI"
                type="checkbox"
                checked={sendDataToAI}
                onChange={(e) => setSendDataToAI(e.target.checked)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="sendDataToAI" className="font-medium text-slate-700 dark:text-slate-300">
                Enable AI Recognition
              </label>
              <p className="text-slate-500 dark:text-slate-400">Allow sending meal photos/text to a secure AI service for calorie estimation. Your data is never stored.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
