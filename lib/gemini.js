
import { GoogleGenAI, Type } from '@google/genai';

const schema = {
  type: Type.OBJECT,
  properties: {
    mealName: {
      type: Type.STRING,
      description: "A concise, descriptive name for the meal, e.g., 'Two scrambled eggs with toast'."
    },
    estimatedCalories: {
      type: Type.INTEGER,
      description: "The estimated total calorie count (kcal) for the meal. Provide a single integer value."
    },
    breakdown: {
        type: Type.ARRAY,
        description: "A breakdown of the components of the meal with estimated quantities and calories.",
        items: {
            type: Type.OBJECT,
            properties: {
                itemName: {
                    type: Type.STRING,
                    description: "The name of the food item (e.g., 'Scrambled Eggs', 'Whole Wheat Toast')."
                },
                quantity: {
                    type: Type.STRING,
                    description: "The estimated quantity of the item (e.g., '2 large', '100g', '1 cup', '2 slices')."
                },
                calories: {
                    type: Type.INTEGER,
                    description: "The estimated calories (kcal) for this specific item."
                }
            },
            required: ["itemName", "quantity", "calories"]
        }
    }
  },
  required: ["mealName", "estimatedCalories", "breakdown"],
};

const goalSchema = {
  type: Type.OBJECT,
  properties: {
    dailyCalories: {
      type: Type.INTEGER,
      description: "The calculated daily calorie goal (kcal) based on the user's profile and goals."
    },
    reasoning: {
      type: Type.STRING,
      description: "A short explanation of how this goal was calculated (e.g., 'Based on TDEE of 2000 minus 500 for weight loss')."
    }
  },
  required: ["dailyCalories", "reasoning"],
};

export const calculateGoal = async (userInfo, apiKey) => {
  if (!apiKey) {
    return {
      dailyCalories: 2000,
      reasoning: "Sample calculation (No API Key provided)."
    };
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `Calculate the daily calorie target for a user with the following profile:
  - Age: ${userInfo.age}
  - Gender: ${userInfo.gender}
  - Height: ${userInfo.height} cm
  - Weight: ${userInfo.weight} kg
  - Activity Level: ${userInfo.activityLevel}
  - Goal: ${userInfo.goal}
  
  Provide a JSON response with the recommended 'dailyCalories' (integer) and a brief 'reasoning'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: goalSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API for goal calculation:", error);
    throw new Error("Could not calculate calorie goal.");
  }
};

export const analyzeMeal = async (text, image, apiKey) => {
  if (!apiKey) {
    // Return mock data
    return {
      mealName: 'Sample Meal (No API Key)', 
      estimatedCalories: 350,
      breakdown: [
          { itemName: 'Item 1', quantity: '100g', calories: 200 },
          { itemName: 'Item 2', quantity: '1 cup', calories: 150 },
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const promptParts = [];
  
  if (image && image.data && image.mimeType) {
    promptParts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      }
    });
  }
  
  if (text) {
    promptParts.push({ text });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: promptParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get calorie estimate from AI.");
  }
};
