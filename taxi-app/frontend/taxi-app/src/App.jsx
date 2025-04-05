import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LocationTracker from './LocationTracker'
import RideMap from './RideMap'
import DriverMap from './DriverMap'
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import UserPage from './UserPage'

function App() {
  const [count, setCount] = useState(0)
  const userId = 1;

  return (

      <Routes>
        <Route path="/:userId" element={<UserPage />} />
      </Routes>

  )
}

export default App
