
import { resizeAndConvertToBase64 } from './imageService';
import { AIEstimate, GoalCalculationResult, Gender, ActivityLevel, Goal } from '../types';

export const getCaloriesFromText = async (description: string): Promise<AIEstimate> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `Analyze the following meal description and provide a JSON response with the meal's name, total estimated calorie count, and a detailed breakdown of each food item with its quantity and individual calories. Description: "${description}"`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result as AIEstimate;
  } catch (error) {
    console.error("Error calling API:", error);
    throw new Error("Could not get calorie estimate from AI.");
  }
};

export const getCaloriesFromImage = async (imageFile: File): Promise<AIEstimate> => {
  const { base64, mimeType } = await resizeAndConvertToBase64(imageFile, 512, 512, 0.7);
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: {
          data: base64,
          mimeType: mimeType,
        },
        text: "Analyze the meal in this image and provide a JSON response with a descriptive name, the total estimated calorie count, and a detailed breakdown of each food item with its quantity and individual calories."
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result as AIEstimate;
  } catch (error) {
    console.error("Error calling API:", error);
    throw new Error("Could not get calorie estimate from AI.");
  }
};

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export const calculateCalorieGoal = async (profile: UserProfile): Promise<GoalCalculationResult> => {
  try {
    const response = await fetch('/api/calculate-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result as GoalCalculationResult;
  } catch (error) {
    console.error("Error calling API:", error);
    throw new Error("Could not calculate calorie goal.");
  }
};
