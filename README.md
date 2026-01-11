# QuickCalorie - Smart AI Calorie Tracker

QuickCalorie is a modern, privacy-focused calorie tracking application powered by Google Gemini AI. It simplifies food logging by allowing users to describe their meals or upload photos to get instant calorie estimates, rather than searching through tedious food databases.

![QuickCalorie Screenshot](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Features

-   **📸 AI Image Recognition**: Snap a photo of your meal, and the AI will identify the food items and estimate portion sizes and calories.
-   **📝 Natural Language Logging**: Simply type "Two eggs and a slice of toast" to log your meal.
-   **🎯 Smart Goal Calculator**: Not sure what your target should be? Use the built-in AI calculator to determine your ideal daily calorie intake based on your age, gender, stats, and fitness goals.
-   **🔒 Privacy First**: Your meal logs and personal settings are stored locally in your browser (LocalStorage). We don't store your personal data on our servers.
-   **📊 Progress Tracking**: Visual dashboard to track your daily consumption against your goal.
-   **🔄 Dual Unit Support**: Toggle seamlessly between Calories (kcal) and Kilojoules (kJ).

## 🛠️ Tech Stack

-   **Frontend**: React (TypeScript), Vite, Tailwind CSS
-   **Backend**: Node.js (Express for local dev), Vercel Serverless Functions (Production)
-   **AI**: Google Gemini API (`gemini-2.0-flash-exp`)

## 💻 Getting Started Locally

Follow these steps to run the project on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/mattmelloy/SimpleCalorie.git
cd SimpleCalorie
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```
> You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the application
```bash
npm run dev
```
This command runs both the Vite frontend (port 5173) and the local backend server (port 3001) concurrently. Open `http://localhost:5173` in your browser.

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com) and click "Add New Project".
3.  Import your GitHub repository.
4.  **Important**: In the project settings, go to **Environment Variables** and add `GEMINI_API_KEY` with your key.
5.  Click **Deploy**.

Vercel will automatically detect the Vite frontend and deploy the `api/` directory as serverless functions.

## 📁 Project Structure

-   `/api`: Serverless functions for Vercel deployment (Production backend).
-   `/server`: Local Express server for development (mimics Vercel environment).
-   `/lib`: Shared logic for AI interaction (used by both local and prod backends).
-   `/components`: React UI components.
-   `/services`: Frontend API services.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
