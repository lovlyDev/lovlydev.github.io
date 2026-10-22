import { useState, type ReactNode } from 'react';
import { stack, TELEGRAM } from './data/profile';
import { type Project } from './data/projects';
import { useLang } from './i18n';
import { Icon } from './components/Icon';
import { Lightbox } from './components/Lightbox';
import { WorkShowcase } from './components/WorkShowcase';
import { VfxShowcase } from './components/VfxShowcase';
import { SitesShowcase } from './components/SitesShowcase';
import { Facts } from './components/Facts';
import { SectionLines } from './components/SectionLines';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { ServicesList } from './components/ServicesList';
import { StackLayers } from './components/StackLayers';


function Nav() {
  const { lang, setLang, t } = useLang();
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">lovlyDev</a>
        <div className="nav-links">
          <a href="#work">{t({ ru: 'Работы', en: 'Work' })}</a>
          <a href="#sites">{t({ ru: 'Сайты', en: 'Websites' })}</a>
          <a href="#vfx">Roblox</a>
          <a href="#services">{t({ ru: 'Услуги', en: 'Services' })}</a>
          <a href="#about">{t({ ru: 'Обо мне', en: 'About' })}</a>
          <a href="./price.html" className="nav-price">{t({ ru: 'Цены', en: 'Pricing' })}</a>
        </div>
        <div className="lang" role="group" aria-label="Language">
          {(['ru', 'en'] as const).map(l => (
            <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        <a className="btn btn-primary btn-sm" href={TELEGRAM} target="_blank" rel="noreferrer">
          {t({ ru: 'Обсудить проект', en: 'Start a project' })}
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <header className="hero wrap" id="top">
      <p className="mono muted hero-tag">
        <span className="dot" />{t({ ru: 'Принимаю заказы', en: 'Available for work' })}
      </p>
      <h1>
        {t({ ru: 'Артём — разработчик.', en: 'Artem — developer.' })}
        <span className="muted"> {t({
          ru: 'Делаю сайты, веб-сервисы и десктоп-приложения: от GPU-вычислений на C++ до интерфейса на React.',
          en: 'I build websites, web services and desktop apps: from GPU compute in C++ to React interfaces.',
        })}</span>
      </h1>
      <div className="hero-cta">
        <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
          {t({ ru: 'Обсудить проект', en: 'Start a project' })} <Icon name="arrow" />
        </a>
        <a className="btn btn-ghost" href="#work">{t({ ru: 'Смотреть работы', en: 'See work' })}</a>
      </div>
      <Facts />
    </header>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="section wrap" id={id}>
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const { t } = useLang();
  const [view, setView] = useState<{ p: Project; i: number } | null>(null);

  return (
    <>
      <Nav />
      <SectionLines />
      <main>
        <Hero />

        <WorkShowcase onOpen={(p, i) => setView({ p, i })} />
        <VfxShowcase />
        <SitesShowcase />

        <Section id="services" title={t({ ru: 'Чем могу помочь', en: 'What I can do for you' })}>
          <ServicesList />

          <div className="pricing">
            <p>
              <strong>{t({ ru: 'Сколько стоит?', en: 'How much?' })}</strong>{' '}
              <span className="muted">{t({ ru: 'Посчитайте примерную цену и сроки в калькуляторе — это займёт пару минут.', en: 'Get a rough price and timeline in the calculator — it takes a couple of minutes.' })}</span>
            </p>
            <div className="pricing-btns">
              <a className="btn btn-primary" href="./price.html">{t({ ru: 'Посчитать стоимость', en: 'Estimate the price' })} <Icon name="arrow" /></a>
              <a className="btn btn-ghost" href={TELEGRAM} target="_blank" rel="noreferrer">{t({ ru: 'Обсудить проект', en: 'Start a project' })}</a>
            </div>
          </div>
        </Section>

        <Process />

        <Section id="about" title={t({ ru: 'Обо мне', en: 'About' })}>
          <div className="about">
            <div className="about-text">
              <p>{t({
                ru: 'Меня зовут Артём, в сети — lovlyDev. Мне 18, живу в Курске, программирую 4 года. Начинал с вёрстки, сейчас пишу продукты целиком: вычислительные ядра на C++, бэкенды и десктоп на Rust, интерфейсы на TypeScript и React.',
                en: 'I’m Artem, lovlyDev online. I’m 18, based in Kursk, and have been programming for 4 years. I started with HTML/CSS and now build whole products: compute cores in C++, backends and desktop in Rust, interfaces in TypeScript and React.',
              })}</p>
              <p className="muted">{t({
                ru: 'Мне важно, чтобы продукт был быстрым, понятным и доведённым до релиза. ИИ использую как инструмент — для автоматизации и умных функций внутри приложений, но архитектуру и код отвечаю за сам.',
                en: 'I care about products being fast, clear and actually shipped. I use AI as a tool — for automation and smart features inside apps — but I own the architecture and the code.',
              })}</p>
            </div>
            <StackLayers />
            <dl className="spec">
              <div><dt className="mono">{t({ ru: 'Город', en: 'Based in' })}</dt><dd>{t({ ru: 'Курск, Россия', en: 'Kursk, Russia' })}</dd></div>
              <div><dt className="mono">{t({ ru: 'Возраст', en: 'Age' })}</dt><dd>18</dd></div>
              {stack.map((s, i) => <div key={i}><dt className="mono">{t(s.title)}</dt><dd>{t(s.items)}</dd></div>)}
            </dl>
          </div>
        </Section>

        <Contact />
      </main>

      <footer className="footer wrap mono muted">
        <span>© {new Date().getFullYear()} {t({ ru: 'Артём', en: 'Artem' })} / lovlyDev</span>
        <a href="#top">{t({ ru: 'Наверх', en: 'Top' })} ↑</a>
      </footer>

      {view && <Lightbox project={view.p} start={view.i} onClose={() => setView(null)} />}
    </>
  );
}
