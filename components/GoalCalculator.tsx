
import React, { useState } from 'react';
import Modal from './common/Modal';
import { Gender, ActivityLevel, Goal, GoalCalculationResult } from '../types';
import { calculateCalorieGoal, UserProfile } from '../services/geminiService';

interface GoalCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (result: GoalCalculationResult) => void;
}

const GoalCalculator: React.FC<GoalCalculatorProps> = ({ isOpen, onClose, onCalculate }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: Gender.Male,
    height: 175,
    weight: 75,
    activityLevel: ActivityLevel.Moderate,
    goal: Goal.Maintain
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await calculateCalorieGoal(profile);
      onCalculate(result);
      onClose();
    } catch (err) {
      setError("Failed to calculate goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Goal Calculator">
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Tell us a bit about yourself, and our AI will estimate your ideal daily calorie intake.
        </p>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                <select
                    value={profile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                >
                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Height (cm)</label>
                <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleChange('height', parseInt(e.target.value))}
                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Weight (kg)</label>
                <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Activity Level</label>
            <select
                value={profile.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
                className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
            >
                {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Goal</label>
            <select
                value={profile.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
            >
                {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400"
        >
            {isLoading ? 'Calculating...' : 'Calculate My Goal'}
        </button>
      </div>
    </Modal>
  );
};

export default GoalCalculator;
