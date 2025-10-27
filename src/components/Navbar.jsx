import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import Button from './Button'

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold">Task & API Demo</Link>
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" end className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}>Home</NavLink>
              <NavLink to="/tasks" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}>Tasks</NavLink>
              <NavLink to="/api" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}>API</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
