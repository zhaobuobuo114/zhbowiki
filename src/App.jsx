import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Splash from './components/Splash.jsx'
import BackgroundFX from './components/BackgroundFX.jsx'
import Landing from './pages/Landing.jsx'
import { useApp } from './store.jsx'

export default function App() {
  const { staticMode } = useApp()
  const [showSplash, setShowSplash] = useState(
    () => !staticMode && sessionStorage.getItem('zhbo-splash') !== '1'
  )

  const finishSplash = () => {
    sessionStorage.setItem('zhbo-splash', '1')
    setShowSplash(false)
  }

  return (
    <>
      <BackgroundFX />
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
      {showSplash && <Splash onDone={finishSplash} />}
    </>
  )
}
