import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Splash from './components/Splash.jsx'
import BackgroundFX from './components/BackgroundFX.jsx'
import Landing from './pages/Landing.jsx'
import Plugins from './pages/Plugins.jsx'
import PluginDetail from './pages/PluginDetail.jsx'
import NotFound from './pages/NotFound.jsx'
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
        <Route path="/" element={<Landing />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/plugins/:slug" element={<PluginDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showSplash && <Splash onDone={finishSplash} />}
    </>
  )
}
