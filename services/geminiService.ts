import { GoogleGenAI, Type } from "@google/genai";
import { resizeAndConvertToBase64 } from './imageService';
import { AIEstimate } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

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


const generateContentWithSchema = async (promptParts: any[]): Promise<AIEstimate> => {
  if (!process.env.API_KEY) {
      return { 
          mealName: 'Sample Meal (No API Key)', 
          estimatedCalories: 350,
          breakdown: [
              { itemName: 'Item 1', quantity: '100g', calories: 200 },
              { itemName: 'Item 2', quantity: '1 cup', calories: 150 },
          ]
      };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: promptParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (
      typeof result.mealName === 'string' &&
      typeof result.estimatedCalories === 'number' &&
      Array.isArray(result.breakdown) &&
      result.breakdown.every((item: any) => 
        typeof item.itemName === 'string' &&
        typeof item.quantity === 'string' &&
        typeof item.calories === 'number'
      )
    ) {
      return result as AIEstimate;
    } else {
      throw new Error('Invalid JSON structure from Gemini API');
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get calorie estimate from AI.");
  }
};

export const getCaloriesFromText = async (description: string): Promise<AIEstimate> => {
  const textPart = { text: `Analyze the following meal description and provide a JSON response with the meal's name, total estimated calorie count, and a detailed breakdown of each food item with its quantity and individual calories. Description: "${description}"` };
  return generateContentWithSchema([textPart]);
};

export const getCaloriesFromImage = async (imageFile: File): Promise<AIEstimate> => {
  const { base64, mimeType } = await resizeAndConvertToBase64(imageFile, 512, 512, 0.7);
  
  const imagePart = {
    inlineData: {
      data: base64,
      mimeType: mimeType,
    },
  };
  const textPart = { text: "Analyze the meal in this image and provide a JSON response with a descriptive name, the total estimated calorie count, and a detailed breakdown of each food item with its quantity and individual calories." };
  
  return generateContentWithSchema([imagePart, textPart]);
};
