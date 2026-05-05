import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light to-white">
      <h1 className="text-3xl font-bold text-primary mb-4">
        データ・AI試験対策
      </h1>
      <p className="text-gray-600 mb-6">
        Vite + React + TypeScript + Tailwind CSS
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow transition-colors"
      >
        count is {count}
      </button>
    </div>
  )
}

export default App
