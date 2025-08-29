
import React, { useState, useEffect } from 'react';
import { UserSettings, Unit } from '../types';
import Modal from './common/Modal';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onClearData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, currentSettings, onSave, onClearData }) => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all your meal logs? This action cannot be undone.")) {
        onClearData();
        onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        <div>
          <label htmlFor="dailyGoal" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Daily Goal ({settings.unit})
          </label>
          <input
            type="number"
            id="dailyGoal"
            value={settings.dailyGoal}
            onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value, 10) || 0 })}
            className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Units</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
             <button
                type="button"
                onClick={() => setSettings({ ...settings, unit: Unit.Kcal })}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${settings.unit === Unit.Kcal ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                Calories (kcal)
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, unit: Unit.KJ })}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${settings.unit === Unit.KJ ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
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
                checked={settings.sendDataToAI}
                onChange={(e) => setSettings({ ...settings, sendDataToAI: e.target.checked })}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="sendDataToAI" className="font-medium text-slate-700 dark:text-slate-300">
                Enable AI Recognition
              </label>
              <p className="text-slate-500 dark:text-slate-400">Allow sending data for calorie estimation.</p>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <button
                onClick={handleSave}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save Changes
            </button>
             <button
                onClick={handleClearData}
                className="w-full flex justify-center py-3 px-4 border border-red-300 dark:border-red-600/50 rounded-lg shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Clear All Meal Logs
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default Settings;
