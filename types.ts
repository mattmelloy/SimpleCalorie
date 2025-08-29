export enum MealCategory {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snacks = 'Snacks',
}

export enum Unit {
  Kcal = 'kcal',
  KJ = 'kJ',
}

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  calories: number; // Base calories from AI (in kcal)
  portionFactor: number; // From slider, e.g., 1.2
  category: MealCategory;
  source: 'photo' | 'text';
}

export interface UserSettings {
  dailyGoal: number; // always in kcal
  unit: Unit;
  sendDataToAI: boolean;
}

export interface MealLog {
  [date: string]: {
    [category in MealCategory]?: LogEntry[];
  };
}

export interface AIBreakdownItem {
  itemName: string;
  quantity: string;
  calories: number;
}

export interface AIEstimate {
  mealName: string;
  estimatedCalories: number;
  breakdown: AIBreakdownItem[];
}
