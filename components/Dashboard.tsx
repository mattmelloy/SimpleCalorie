
import React, { useMemo } from 'react';
import { LogEntry, UserSettings, MealCategory, Unit } from '../types';
import { KCAL_TO_KJ } from '../constants';
import { getTodayDateString } from '../utils';

interface DashboardProps {
  settings: UserSettings;
  logs: LogEntry[];
  onAddLog: () => void;
  onOpenSettings: () => void;
  onDeleteLog: (id: string) => void;
}

const MealCategoryIcons: { [key in MealCategory]: React.FC<{className: string}> } = {
  [MealCategory.Breakfast]: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4C2.89 3 2 3.89 2 5V12C2 13.11 2.89 14 4 14H18C18.9 14 19.67 13.43 19.9 12.58L22 5.58V5C22 3.89 21.11 3 20 3M6.5 8.5C5.67 8.5 5 7.83 5 7C5 6.17 5.67 5.5 6.5 5.5S8 6.17 8 7C8 7.83 7.33 8.5 6.5 8.5M17.5 8.5C16.67 8.5 16 7.83 16 7C16 6.17 16.67 5.5 17.5 5.5S19 6.17 19 7C19 7.83 18.33 8.5 17.5 8.5M4 19H20V16H4V19Z"/></svg>,
  [MealCategory.Lunch]: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2V22C5.9 21.5 2 17.1 2 12C2 6.9 5.9 2.5 11 2M13 2V12H22C22 6.9 18.1 2.5 13 2M13 14V22C18.1 21.5 22 17.1 22 12C22 13.1 21.8 14 21.5 15H13V14Z" /></svg>,
  [MealCategory.Dinner]: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19V2H5V19H19M19 21H5C3.9 21 3 20.11 3 19V2C3 .89 3.9 0 5 0H19C20.11 0 21 .89 21 2V19C21 20.11 20.11 21 19 21M7 11V14H17V11H7M9 4V7H11V4H9M13 4V7H15V4H13Z" /></svg>,
  [MealCategory.Snacks]: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58,11.09L17,14.09V20A1,1 0 0,1 16,21H8A1,1 0 0,1 7,20V14.09L2.42,11.09A1,1 0 0,1 2,10.24V5A1,1 0 0,1 3,4H21A1,1 0 0,1 22,5V10.24A1,1 0 0,1 21.58,11.09M15,19H9V14.5L12,16.5L15,14.5V19M20,6H4V9.76L12,14.24L20,9.76V6Z" /></svg>,
};


const Dashboard: React.FC<DashboardProps> = ({ settings, logs, onAddLog, onOpenSettings, onDeleteLog }) => {
  const { dailyGoal, unit } = settings;

  const today = getTodayDateString();
  const todayLogs = useMemo(() => logs.filter(log => log.date === today), [logs, today]);

  const totalCalories = useMemo(() => 
    todayLogs.reduce((acc, log) => acc + (log.calories * log.portionFactor), 0),
    [todayLogs]
  );
  
  const displayValue = (kcal: number) => {
    const value = unit === Unit.KJ ? kcal * KCAL_TO_KJ : kcal;
    return Math.round(value);
  };

  const progress = Math.min((totalCalories / dailyGoal) * 100, 100);

  const groupedLogs = useMemo(() => {
    return todayLogs.reduce((acc, log) => {
      (acc[log.category] = acc[log.category] || []).push(log);
      return acc;
    }, {} as { [key in MealCategory]?: LogEntry[] });
  }, [todayLogs]);
  
  const mealCategories = [MealCategory.Breakfast, MealCategory.Lunch, MealCategory.Dinner, MealCategory.Snacks];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Today's Log</h1>
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      </header>

      <main className="p-4 pb-28">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Consumed</p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{displayValue(totalCalories)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Daily Goal</p>
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{displayValue(dailyGoal)} {unit}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {mealCategories.map(category => (
            groupedLogs[category] && groupedLogs[category]!.length > 0 && (
                <div key={category} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      {React.createElement(MealCategoryIcons[category], { className: 'w-6 h-6 text-slate-500' })}
                      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{category}</h2>
                    </div>
                    <div className="space-y-3">
                    {groupedLogs[category]!.map(log => (
                        <div key={log.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{log.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{displayValue(log.calories * log.portionFactor)} {unit}</p>
                            </div>
                            <button onClick={() => onDeleteLog(log.id)} className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            )
        ))}
        
        {todayLogs.length === 0 && (
            <div className="text-center py-16">
                <p className="text-slate-500 dark:text-slate-400">No meals logged for today.</p>
                <p className="text-slate-500 dark:text-slate-400">Tap the '+' button to add your first meal!</p>
            </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6">
        <button onClick={onAddLog} className="bg-indigo-600 text-white rounded-full p-4 shadow-2xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 transition-transform transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
