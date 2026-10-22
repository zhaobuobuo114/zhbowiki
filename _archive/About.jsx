import { motion } from 'framer-motion'
import { Mail, MessageSquare, Wrench } from 'lucide-react'
import { useApp } from '../store.jsx'
import { Reveal, StaggerGroup, StaggerItem } from '../components/Motion.jsx'
import Logo from '../components/Logo.jsx'

export default function About() {
  const { t } = useApp()
  const services = t('about.services')

  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <Logo size={52} />
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-neon">
              ABOUT
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-ink md:text-4xl">
              {t('about.title')}
            </h1>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/90">
          {t('about.lead')}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {t('about.body')}
        </p>
      </Reveal>

      <section className="mt-14">
        <h2 className="section-title text-xl">{t('about.servicesTitle')}</h2>
        <StaggerGroup className="mt-5 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s}>
              <div className="glass-card h-full p-5">
                <Wrench size={18} className="text-neon" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{s}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mt-14">
        <h2 className="section-title text-xl">{t('about.contactTitle')}</h2>
        <Reveal>
          <div className="glass mt-5 overflow-hidden rounded-2xl p-6">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              {t('about.contactDesc')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="mailto:zhbo@example.com"
                className="btn-ghost text-sm"
              >
                <Mail size={15} /> zhbo@example.com
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://github.com/zhbo"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-sm"
              >
                <MessageSquare size={15} /> GitHub
              </motion.a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
