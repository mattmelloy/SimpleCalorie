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

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary (little or no exercise)',
  Light = 'Lightly active (light exercise/sports 1-3 days/week)',
  Moderate = 'Moderately active (moderate exercise/sports 3-5 days/week)',
  Active = 'Very active (hard exercise/sports 6-7 days/week)',
  ExtraActive = 'Extra active (very hard exercise & physical job)'
}

export enum Goal {
  Lose = 'Lose Weight',
  Maintain = 'Maintain Weight',
  Gain = 'Gain Muscle'
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

export interface GoalCalculationResult {
  dailyCalories: number;
  reasoning: string;
}
