import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Boxes,
  Home,
  Info,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react'
import Logo from './Logo.jsx'
import Footer from './Footer.jsx'
import { LangSwitch, ThemeToggle } from './Controls.jsx'
import { useApp } from '../store.jsx'

function NavItems({ collapsed = false, onNavigate }) {
  const { t } = useApp()
  const items = [
    { to: '/home', label: t('nav.home'), Icon: Home },
    { to: '/plugins', label: t('nav.plugins'), Icon: Boxes },
    { to: '/about', label: t('nav.about'), Icon: Info }
  ]

  return (
    <nav className="mt-5 flex-1 space-y-1 px-2">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              isActive
                ? 'bg-[rgba(0,240,255,0.1)] text-neon'
                : 'text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-ink'
            } ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? label : undefined}
        >
          {({ isActive }) => (
            <>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-neon shadow-neon"
                  style={{ marginLeft: collapsed ? 0 : 'auto' }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarBody({ collapsed, setCollapsed, onNavigate }) {
  return (
    <>
      <div
        className={`flex h-16 items-center gap-3 border-b border-line px-4 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <Logo size={34} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-sm tracking-[0.2em] text-ink">
              ZHBOWiki
            </p>
            <p className="mt-0.5 truncate font-display text-[9px] tracking-[0.24em] text-muted">
              COBBLEMON WIKI
            </p>
          </div>
        )}
      </div>

      <NavItems collapsed={collapsed} onNavigate={onNavigate} />

      <div className="border-t border-line p-3">
        <div
          className={`flex ${
            collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'
          }`}
        >
          <ThemeToggle compact />
          <LangSwitch vertical={collapsed} />
          {setCollapsed && (
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-neon/50 hover:text-neon"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default function SiteLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('zhbo-side') === '1'
  )
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('zhbo-side', collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    setDrawer(false)
  }, [location.pathname])

  const width = collapsed ? 84 : 264

  return (
    <div
      className="min-h-screen md:pl-[var(--side-w)]"
      style={{ '--side-w': `${width}px` }}
    >
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-line bg-[var(--c-panel)] backdrop-blur-2xl transition-[width] duration-300 md:flex"
        style={{ width }}
      >
        <SidebarBody
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNavigate={undefined}
        />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-[var(--c-bg)] px-4 md:hidden">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <Logo size={28} glow={false} />
        <span className="font-display text-xs tracking-[0.2em] text-ink">
          ZHBOWiki
        </span>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-12">
        <Outlet />
        <Footer />
      </main>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-line bg-[var(--c-panel-solid)] md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <SidebarBody
                collapsed={false}
                setCollapsed={null}
                onNavigate={() => setDrawer(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
