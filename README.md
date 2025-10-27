# React.js and Tailwind CSS Assignment

This assignment focuses on building a responsive React application using JSX and Tailwind CSS, implementing component architecture, state management, hooks, and API integration.

## Assignment Overview

You will:
1. Set up a React project with Vite and Tailwind CSS
2. Create reusable UI components
3. Implement state management using React hooks
4. Integrate with external APIs
5. Style your application using Tailwind CSS

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Files Included

- `Week3-Assignment.md`: Detailed assignment instructions
- Starter files for your React application:
  - Basic project structure
  - Pre-configured Tailwind CSS
  - Sample component templates

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Code editor (VS Code recommended)

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── api/             # API integration functions
├── utils/           # Utility functions
└── App.jsx          # Main application component
```

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all required components and features
2. Implement proper state management with hooks
3. Integrate with at least one external API
4. Style your application with Tailwind CSS
5. Deploy your application and add the URL to your README.md

## Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/) 

## Notes about the added demo scaffold

I added a working Vite + React + Tailwind scaffold into this workspace with the following files:

- `package.json`, `vite.config.js`, `index.html`
- `tailwind.config.cjs`, `postcss.config.cjs`
- `src/main.jsx`, `src/App.jsx`, `src/styles/index.css`
- `src/components` (Button, Card, Navbar, Footer, Layout, TaskManager)
- `src/context/ThemeContext.jsx`, `src/hooks/useLocalStorage.js`
- `src/pages/ApiPage.jsx`

Run `npm install` and then `npm run dev` to start the dev server. Tailwind dark mode uses the `class` strategy; use the Navbar's theme button to toggle.

## Backend (MongoDB) integration

I added a small Express + Mongoose backend scaffold under `backend/` that exposes a Tasks REST API at `/api/tasks`.

Quick steps to run the backend locally:

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` to your MongoDB connection string (Atlas or local).

2. Install backend dependencies and start the server (from repository root):

```powershell
cd backend
npm install
npm run dev   # uses nodemon
```

The server runs by default on port 4000 and will print `Server listening on http://localhost:4000` when connected to MongoDB.

API endpoints:

- GET `/api/tasks?search=&page=1&limit=10` — list tasks with optional search and pagination
- POST `/api/tasks` { text } — create a task
- PUT `/api/tasks/:id` { text?, completed? } — update a task
- DELETE `/api/tasks/:id` — delete a task

Frontend integration:

- I added `src/hooks/useApiTasks.js` which talks to `VITE_API_URL` (or `/api` by default). In dev, if you run the backend on port 4000, configure Vite to proxy requests to the backend or set `VITE_API_URL` to `http://localhost:4000/api`.

To proxy in Vite, add the following to `vite.config.js` (example):

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   plugins: [react()],
   server: {
      proxy: {
         '/api': 'http://localhost:4000'
      }
   }
})
```

Then update TaskManager to use `useApiTasks` instead of the localStorage hook (or keep both while developing). The `useApiTasks` hook exposes `tasks, addTask, toggleTask, deleteTask, fetchTasks, loading, error`.

Security notes:

- Never commit your real MongoDB credentials. Use environment variables and `.env` (and add `backend/.env` to `.gitignore`).
- For production, use proper auth and rate-limiting. This scaffold is intended for local development and learning.