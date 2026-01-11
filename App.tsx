
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserSettings, LogEntry, MealCategory } from './types';
import { getTodayDateString } from './utils';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LogEntryForm from './components/LogEntryForm';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<UserSettings | null>('user-settings', null);
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('meal-logs', []);
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleOnboardingComplete = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleSaveLog = (logData: Omit<LogEntry, 'id' | 'date'>) => {
    const newLog: LogEntry = {
      ...logData,
      id: new Date().getTime().toString(),
      date: getTodayDateString(),
    };
    setLogs(prevLogs => [...prevLogs, newLog]);
  };
  
  const handleDeleteLog = (id: string) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };
  
  const handleClearData = () => {
    setLogs([]);
  };

  if (!isReady) {
    return null; // or a loading spinner
  }

  if (!settings) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <Dashboard
        settings={settings}
        logs={logs}
        onAddLog={() => setIsLogModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onDeleteLog={handleDeleteLog}
      />
      
      <LogEntryForm 
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveLog}
        settings={settings}
      />
      
      <Settings
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentSettings={settings}
        onSave={setSettings}
        onClearData={handleClearData}
      />
    </>
  );
};

export default App;
