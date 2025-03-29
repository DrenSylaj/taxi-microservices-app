import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LocationTracker from './LocationTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <LocationTracker />
  )
}

export default App
