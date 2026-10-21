import { siteRepo, sites, siteUrl } from '../data/sites';
import { useLang } from '../i18n';
import { Icon } from './Icon';

export function SitesShowcase() {
  const { t } = useLang();
  return (
    <section className="section wrap" id="sites">
      <div className="section-head"><h2>{t({ ru: 'Сайты', en: 'Websites' })}</h2></div>
      <p className="muted section-lead sites-lead">
        {t({
          ru: 'Концепты для вымышленных бизнесов: у каждого свой стиль, шрифты и анимации. Все адаптивные — откройте и посмотрите вживую.',
          en: 'Concepts for fictional businesses, each with its own style, fonts and motion. All responsive — open them and see for yourself.',
        })}
      </p>
      <div className="sites">
        {sites.map(s => (
          <article className="site" key={s.id}>
            <a className="site-cover" href={siteUrl(s.id)} target="_blank" rel="noreferrer" aria-label={`${s.name} — ${t({ ru: 'открыть сайт', en: 'open website' })}`}>
              <img src={`./sites/${s.id}.webp`} alt="" loading="lazy" />
              <span className="site-phone"><img src={`./sites/${s.id}-m.webp`} alt="" loading="lazy" /></span>
            </a>
            <div className="site-info">
              <div className="site-title">
                <h3>{s.name}</h3>
                <span className="mono muted">{t(s.kind)} · {t({ ru: 'концепт', en: 'concept' })}</span>
              </div>
              <p className="muted">{t(s.about)}</p>
              <div className="site-meta mono">
                <span className="swatches">{s.palette.map(c => <i key={c} style={{ background: c }} title={c} />)}</span>
                <span>{s.fonts}</span>
              </div>
              <div className="work-links">
                <a className="link" href={siteUrl(s.id)} target="_blank" rel="noreferrer">{t({ ru: 'Открыть сайт', en: 'Open website' })} <Icon name="arrowUpRight" size={14} /></a>
                <a className="link" href={siteRepo(s.id)} target="_blank" rel="noreferrer">{t({ ru: 'Код', en: 'Source' })} <Icon name="arrowUpRight" size={14} /></a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
