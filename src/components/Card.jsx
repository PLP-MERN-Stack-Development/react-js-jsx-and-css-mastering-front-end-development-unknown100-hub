import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  )
}
