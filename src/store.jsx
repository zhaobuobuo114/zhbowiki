import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { makeT, pick } from './i18n'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const params = new URLSearchParams(window.location.search)
  const staticMode =
    params.has('static') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [theme] = useState('dark')
  const [lang, setLang] = useState(() => {
    const p = params.get('lang')
    if (p === 'en' || p === 'zh') return p
    const saved = localStorage.getItem('zhbo-lang')
    return saved === 'en' ? 'en' : 'zh'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.static = staticMode ? '1' : '0'
  }, [staticMode])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
    localStorage.setItem('zhbo-lang', lang)
  }, [lang])

  const t = useMemo(() => makeT(lang), [lang])

  const value = useMemo(
    () => ({
      theme,
      lang,
      setLang,
      t,
      staticMode,
      pick: (v) => pick(v, lang)
    }),
    [theme, lang, t, staticMode]
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  return useContext(AppCtx)
}
