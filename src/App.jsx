import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import TaskManager from './components/TaskManager'
import ApiPage from './pages/ApiPage'
import Card from './components/Card'

function Home() {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-2">Welcome</h2>
      <p className="text-gray-600 dark:text-gray-300">This demo shows component architecture, state management with hooks and API integration using React + Vite + Tailwind.</p>
    </Card>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/api" element={<ApiPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}