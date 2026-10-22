import { useApp } from '../store.jsx'

export default function Footer() {
  const { t } = useApp()

  return (
    <footer className="mt-20 border-t border-line/70 pt-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.18em] text-ink">
            {t('footer.slogan')}
          </p>
          <p className="mt-2 text-xs text-muted">
            © {new Date().getFullYear()} ZHBOWiki · {t('footer.rights')}
          </p>
        </div>
        <p className="text-[11px] tracking-wide text-muted/70">
          {t('footer.built')}
        </p>
      </div>
    </footer>
  )
}
