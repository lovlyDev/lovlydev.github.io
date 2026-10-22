import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { TELEGRAM } from '../data/profile';
import { useLang, type L } from '../i18n';
import { Icon } from '../components/Icon';
import { defaultState, designs, estimate, extras, features, kinds, presets, speeds, supports, units, type State } from './pricing';

const rub = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

/** State lives in the URL hash, so an estimate can be shared as a link. */
function readHash(): State {
  try {
    const m = location.hash.match(/s=([^&]+)/);
    if (m) return { ...defaultState, ...JSON.parse(decodeURIComponent(atob(m[1]))) };
  } catch { /* broken link: start fresh */ }
  return defaultState;
}
const writeHash = (s: State) => history.replaceState(null, '', '#s=' + btoa(encodeURIComponent(JSON.stringify(s))));

/** Number that glides to its new value. */
function useTween(value: number, ms = 600) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current, t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const v = start + (value - start) * (1 - (1 - k) ** 3);
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

function Block({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="pc-block reveal">
      <div className="pc-block-head"><h3>{title}</h3>{hint && <span className="muted">{hint}</span>}</div>
      {children}
    </section>
  );
}

function Seg<T extends { id: string; title: L }>({ items, value, onChange, sub }: { items: T[]; value: string; onChange: (id: string) => void; sub?: (x: T) => string }) {
  const { t } = useLang();
  const i = Math.max(0, items.findIndex(x => x.id === value));
  return (
    <div className="seg" style={{ '--n': items.length, '--i': i } as CSSProperties} role="radiogroup">
      <span className="seg-pill" aria-hidden="true" />
      {items.map(x => (
        <button key={x.id} role="radio" aria-checked={x.id === value} className={x.id === value ? 'on' : ''} onClick={() => onChange(x.id)}>
          {t(x.title)}{sub && <small>{sub(x)}</small>}
        </button>
      ))}
    </div>
  );
}

export function Price() {
  const { lang, setLang, t } = useLang();
  const [s, setS] = useState<State>(readHash);
  const [toast, setToast] = useState('');
  const [faq, setFaq] = useState<number | null>(0);
  const calcRef = useRef<HTMLDivElement>(null);
  const est = useMemo(() => estimate(s), [s]);
  const total = useTween(est.total);
  const days = useTween(est.days, 500);
  const kind = est.kind;

  useEffect(() => { writeHash(s); }, [s]);
  useEffect(() => { document.title = t({ ru: 'Калькулятор стоимости · lovlyDev', en: 'Price calculator · lovlyDev' }); }, [t]);
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2600); return () => clearTimeout(id); }, [toast]);

  const set = (patch: Partial<State>) => setS(prev => {
    const next = { ...prev, ...patch };
    const k = kinds.find(x => x.id === next.kind)!;
    next.pages = Math.min(k.maxPages, Math.max(1, patch.kind && !patch.pages ? Math.max(k.included, Math.min(prev.pages, k.maxPages)) : next.pages));
    return next;
  });
  const toggle = (id: string) => set({ feats: s.feats.includes(id) ? s.feats.filter(f => f !== id) : [...s.feats, id] });
  const applyPreset = (p: Partial<State>) => { setS({ ...defaultState, ...p, extras: { ...defaultState.extras } }); calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const summary = () => [
    t({ ru: 'Здравствуйте! Посчитал проект в калькуляторе:', en: 'Hi! I estimated a project in your calculator:' }),
    ...est.lines.map(l => `• ${t(l.label)} — ${rub(l.price)}`),
    `${t({ ru: 'Итого', en: 'Total' })}: ~${rub(est.total)} · ${t({ ru: 'срок', en: 'timeline' })} ~${est.days} ${t({ ru: 'раб. дней', en: 'working days' })}`,
    est.monthly ? `${t({ ru: 'Поддержка', en: 'Support' })}: ${rub(est.monthly)}/${t({ ru: 'мес', en: 'mo' })}` : '',
    location.href,
  ].filter(Boolean).join('\n');

  const copy = async (text: string, msg: string) => {
    try { await navigator.clipboard.writeText(text); setToast(msg); } catch { setToast(t({ ru: 'Не получилось скопировать', en: 'Could not copy' })); }
  };
  const sendTelegram = async () => {
    await copy(summary(), t({ ru: 'Смета скопирована — вставьте её в чат', en: 'Estimate copied — paste it into the chat' }));
    window.open(TELEGRAM, '_blank', 'noreferrer');
  };

  const included: L[] = [
    { ru: 'Адаптив под телефоны и планшеты', en: 'Works on phones and tablets' },
    { ru: 'Быстрая загрузка', en: 'Fast loading' },
    { ru: 'Базовое SEO: заголовки, описания, карта сайта', en: 'SEO basics: titles, descriptions, sitemap' },
    { ru: 'Подключение Яндекс Метрики', en: 'Analytics set up' },
    { ru: 'Два круга правок', en: 'Two rounds of edits' },
    { ru: 'Публикация и настройка домена', en: 'Publishing and domain setup' },
    { ru: 'Исходный код — ваш', en: 'You own the source code' },
    { ru: 'Месяц поддержки бесплатно', en: 'A month of free support' },
  ];
  const faqs: [L, L][] = [
    [{ ru: 'Цена в калькуляторе окончательная?', en: 'Is the calculator price final?' }, { ru: 'Это ориентир. После короткого разговора я назову точную цену и зафиксирую её в переписке — дальше она не меняется без вашего согласия.', en: 'It’s a guide. After a short chat I’ll give an exact price in writing — it won’t change without your say.' }],
    [{ ru: 'Как проходит оплата?', en: 'How do payments work?' }, { ru: '50% перед началом работ и 50% после сдачи. Крупные проекты делим на этапы и оплачиваем по частям.', en: '50% upfront and 50% on delivery. Larger projects are split into paid milestones.' }],
    [{ ru: 'Что если результат не понравится?', en: 'What if I don’t like the result?' }, { ru: 'Сначала показываю черновик главной страницы — направление согласуем до основной работы. Плюс два круга правок входят в цену.', en: 'You see a draft of the home page first, so we agree on direction early. Two rounds of edits are included.' }],
    [{ ru: 'Кто будет владельцем сайта?', en: 'Who owns the website?' }, { ru: 'Вы. Домен оформляется на вас, исходный код передаю целиком.', en: 'You do. The domain is registered to you and you get the full source code.' }],
    [{ ru: 'Можно ли потом что-то добавить?', en: 'Can I add things later?' }, { ru: 'Да. Сайт собирается так, чтобы его было легко расширять: новые страницы, запись, оплата — в любой момент.', en: 'Yes. Sites are built to grow: new pages, booking or payments any time.' }],
    [{ ru: 'Нужен ли хостинг?', en: 'Do I need hosting?' }, { ru: 'Для обычных сайтов — нет: публикую бесплатно. Платить придётся только за свой домен, около 300–500 ₽ в год.', en: 'Not for regular sites — I publish them for free. You only pay for your own domain, about 300–500 ₽ a year.' }],
    [{ ru: 'Работаете не только в Курске?', en: 'Do you work outside Kursk?' }, { ru: 'Да, работаю удалённо с любым городом. Всё общение — в Telegram.', en: 'Yes, I work remotely with anyone. All communication is on Telegram.' }],
  ];
  const packs = [
    { id: 'card', name: { ru: 'Старт', en: 'Start' }, price: estimate({ ...defaultState, ...presets[0].state } as State).total, items: [{ ru: 'Одна страница', en: 'One page' }, { ru: 'Заявки в Telegram', en: 'Requests to Telegram' }, { ru: 'Галерея работ', en: 'Gallery' }, { ru: 'Готов за неделю', en: 'Ready in a week' }] },
    { id: 'clinic', name: { ru: 'Бизнес', en: 'Business' }, hot: true, price: estimate({ ...defaultState, ...presets[2].state } as State).total, items: [{ ru: 'До 5 страниц', en: 'Up to 5 pages' }, { ru: 'Индивидуальный дизайн', en: 'Custom design' }, { ru: 'Онлайн-запись', en: 'Online booking' }, { ru: 'Прайс и отзывы', en: 'Prices and reviews' }] },
    { id: 'saas', name: { ru: 'Сервис', en: 'Service' }, price: estimate({ ...defaultState, ...presets[4].state } as State).total, items: [{ ru: 'Личный кабинет', en: 'User accounts' }, { ru: 'Админка', en: 'Admin panel' }, { ru: 'База данных', en: 'Database' }, { ru: 'Этапная оплата', en: 'Milestone payments' }] },
  ];

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a href="./" className="logo">lovlyDev</a>
          <div className="nav-links">
            <a href="./">← {t({ ru: 'Портфолио', en: 'Portfolio' })}</a>
            <a href="#calc">{t({ ru: 'Калькулятор', en: 'Calculator' })}</a>
            <a href="#packs">{t({ ru: 'Пакеты', en: 'Packages' })}</a>
            <a href="#faq">{t({ ru: 'Вопросы', en: 'FAQ' })}</a>
          </div>
          <div className="lang" role="group" aria-label="Language">
            {(['ru', 'en'] as const).map(l => <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </div>
          <a className="btn btn-primary btn-sm" href={TELEGRAM} target="_blank" rel="noreferrer">{t({ ru: 'Обсудить проект', en: 'Start a project' })}</a>
        </div>
      </nav>

      <main className="price-page">
        <header className="wrap pc-hero">
          <p className="mono muted hero-tag"><span className="dot" />{t({ ru: 'Калькулятор стоимости', en: 'Price calculator' })}</p>
          <h1>{t({ ru: 'Сколько стоит ваш проект?', en: 'How much will your project cost?' })}<span className="muted"> {t({ ru: 'Соберите его из готовых блоков — цена и сроки посчитаются сразу.', en: 'Build it from blocks — price and timeline update instantly.' })}</span></h1>
          <dl className="pc-facts">
            <div><dt>{t({ ru: 'от', en: 'from' })} {rub(kinds[0].base)}</dt><dd>{t({ ru: 'простой сайт', en: 'a simple site' })}</dd></div>
            <div><dt>{t({ ru: 'от', en: 'from' })} {kinds[0].days} {t({ ru: 'дней', en: 'days' })}</dt><dd>{t({ ru: 'до запуска', en: 'to launch' })}</dd></div>
            <div><dt>50 / 50</dt><dd>{t({ ru: 'предоплата и после сдачи', en: 'upfront and on delivery' })}</dd></div>
            <div><dt>0 ₽</dt><dd>{t({ ru: 'черновик главной до оплаты', en: 'home-page draft before paying' })}</dd></div>
          </dl>
          <div className="pc-presets">
            <span className="mono muted">{t({ ru: 'Начать с примера:', en: 'Start from an example:' })}</span>
            {presets.map(p => (
              <button key={p.id} onClick={() => applyPreset(p.state)}><b>{t(p.title)}</b><small>{t(p.text)}</small></button>
            ))}
          </div>
        </header>

        <div className="wrap pc-grid" id="calc" ref={calcRef}>
          <div className="pc-form">
            <Block title={t({ ru: 'Что делаем', en: 'What are we building' })}>
              <div className="kinds">
                {kinds.map(k => (
                  <button key={k.id} className={`kind${s.kind === k.id ? ' on' : ''}`} onClick={() => set({ kind: k.id })}>
                    <b>{t(k.title)}</b>
                    <span className="muted">{t(k.text)}</span>
                    <span className="mono kind-price">{t({ ru: 'от', en: 'from' })} {rub(k.base)}</span>
                  </button>
                ))}
              </div>
            </Block>

            <Block title={t({ ru: 'Объём', en: 'Size' })} hint={`${t(units(kind, kind.included))} ${t({ ru: 'уже в цене', en: 'included' })}, ${t({ ru: 'дальше', en: 'then' })} +${rub(kind.perPage)}`}>
              <div className="pages">
                <button onClick={() => set({ pages: s.pages - 1 })} disabled={s.pages <= 1} aria-label="−">−</button>
                <output><b>{s.pages}</b> {t(units(kind, s.pages)).slice(String(s.pages).length + 1)}</output>
                <button onClick={() => set({ pages: s.pages + 1 })} disabled={s.pages >= kind.maxPages} aria-label="+">+</button>
                <input type="range" min={1} max={kind.maxPages} value={s.pages} onChange={e => set({ pages: +e.target.value })}
                  style={{ '--fill': `${((s.pages - 1) / Math.max(1, kind.maxPages - 1)) * 100}%` } as CSSProperties} aria-label={t(units(kind, s.pages))} />
              </div>
            </Block>

            <Block title={t({ ru: 'Дизайн', en: 'Design' })}>
              <Seg items={designs} value={s.design} onChange={id => set({ design: id })} sub={d => d.mult === 1 ? t({ ru: 'базовая цена', en: 'base price' }) : `+${Math.round((d.mult - 1) * 100)}%`} />
              <p className="muted pc-note">{t(designs.find(d => d.id === s.design)!.text)}</p>
            </Block>

            <Block title={t({ ru: 'Функции', en: 'Features' })} hint={`${s.feats.length} ${t({ ru: 'выбрано', en: 'selected' })}`}>
              <div className="feats">
                {features.map(f => {
                  const on = s.feats.includes(f.id);
                  return (
                    <button key={f.id} className={`feat${on ? ' on' : ''}`} onClick={() => toggle(f.id)} aria-pressed={on}>
                      <span className="feat-check" aria-hidden="true" />
                      <b>{t(f.title)}</b>
                      <span className="muted">{t(f.text)}</span>
                      <span className="mono feat-price">+{rub(f.price)}</span>
                    </button>
                  );
                })}
              </div>
            </Block>

            <Block title={t({ ru: 'Материалы', en: 'Materials' })}>
              <div className="extras">
                {extras.map(e => (
                  <div key={e.id} className="extra">
                    <span>{t(e.title)}</span>
                    <Seg items={e.options} value={s.extras[e.id]} onChange={id => set({ extras: { ...s.extras, [e.id]: id } })} sub={o => (o.price ? '+' + rub(o.price) : '0 ₽')} />
                  </div>
                ))}
              </div>
            </Block>

            <Block title={t({ ru: 'Сроки', en: 'Timeline' })}>
              <Seg items={speeds} value={s.speed} onChange={id => set({ speed: id })} sub={x => t(x.text)} />
            </Block>

            <Block title={t({ ru: 'После запуска', en: 'After launch' })} hint={t({ ru: 'первый месяц — бесплатно', en: 'first month is free' })}>
              <Seg items={supports} value={s.support} onChange={id => set({ support: id })} sub={x => (x.monthly ? rub(x.monthly) + t({ ru: '/мес', en: '/mo' }) : '0 ₽')} />
            </Block>
          </div>

          <aside className="pc-side">
            <div className="bill">
              <p className="mono muted bill-head">{t({ ru: 'Ваша смета', en: 'Your estimate' })}</p>
              <div className="bill-total"><b>{rub(Math.round(total / 100) * 100)}</b></div>
              <p className="mono muted bill-range">{rub(est.low)} — {rub(est.high)} · ~{Math.round(days)} {t({ ru: 'раб. дней', en: 'working days' })}</p>
              <ul className="bill-lines">
                {est.lines.map(l => <li key={l.label.ru}><span>{t(l.label)}</span><b className="mono">{l.price < 0 ? '−' + rub(-l.price) : rub(l.price)}</b></li>)}
              </ul>
              <div className="bill-pay">
                <div><span className="muted">{t({ ru: 'Предоплата', en: 'Upfront' })}</span><b className="mono">{rub(Math.round(est.total / 2 / 100) * 100)}</b></div>
                <div><span className="muted">{t({ ru: 'После сдачи', en: 'On delivery' })}</span><b className="mono">{rub(est.total - Math.round(est.total / 2 / 100) * 100)}</b></div>
                {est.monthly > 0 && <div><span className="muted">{t({ ru: 'Поддержка', en: 'Support' })}</span><b className="mono">{rub(est.monthly)}{t({ ru: '/мес', en: '/mo' })}</b></div>}
              </div>
              <button className="btn btn-primary bill-main" onClick={sendTelegram}>{t({ ru: 'Обсудить в Telegram', en: 'Discuss on Telegram' })} <Icon name="arrow" /></button>
              <div className="bill-actions">
                <button onClick={() => copy(summary(), t({ ru: 'Смета скопирована', en: 'Estimate copied' }))}>{t({ ru: 'Копировать', en: 'Copy' })}</button>
                <button onClick={() => copy(location.href, t({ ru: 'Ссылка на смету скопирована', en: 'Link copied' }))}>{t({ ru: 'Ссылка', en: 'Link' })}</button>
                <button onClick={() => print()}>PDF</button>
                <button onClick={() => { setS(defaultState); setToast(t({ ru: 'Сброшено', en: 'Reset' })); }}>{t({ ru: 'Сброс', en: 'Reset' })}</button>
              </div>
              <p className="mono bill-note">{t({ ru: 'Это ориентир. Точную цену назову после короткого разговора.', en: 'A guide only. I’ll give an exact price after a short chat.' })}</p>
            </div>
          </aside>
        </div>

        <section className="wrap pc-section">
          <div className="section-head"><h2>{t({ ru: 'Входит в любой проект', en: 'Included in every project' })}</h2></div>
          <ul className="incl">
            {included.map((x, i) => <li key={i} className="reveal" style={{ '--i': i } as CSSProperties}><span className="incl-tick" />{t(x)}</li>)}
          </ul>
        </section>

        <section className="wrap pc-section" id="packs">
          <div className="section-head"><h2>{t({ ru: 'Готовые пакеты', en: 'Packages' })}</h2></div>
          <div className="packs">
            {packs.map((p, i) => (
              <article key={p.id} className={`pack reveal${p.hot ? ' hot' : ''}`} style={{ '--i': i } as CSSProperties}>
                {p.hot && <span className="pack-badge mono">{t({ ru: 'чаще всего', en: 'most popular' })}</span>}
                <h3>{t(p.name)}</h3>
                <p className="pack-price">{t({ ru: 'от', en: 'from' })} {rub(p.price)}</p>
                <ul>{p.items.map((x, k) => <li key={k}>{t(x)}</li>)}</ul>
                <button className={`btn ${p.hot ? 'btn-primary' : 'btn-ghost'}`} onClick={() => applyPreset(presets.find(x => x.id === p.id)!.state)}>{t({ ru: 'Посчитать этот', en: 'Use this one' })}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap pc-section">
          <div className="section-head"><h2>{t({ ru: 'Как проходит оплата', en: 'How payment works' })}</h2></div>
          <div className="paysteps">
            {[
              [{ ru: 'Бесплатно', en: 'Free' }, { ru: 'Черновик главной', en: 'Home-page draft' }, { ru: 'Показываю, как будет выглядеть сайт. Если не нравится — расходимся без оплаты.', en: 'You see how the site will look. Don’t like it? We part ways, nothing owed.' }],
              [{ ru: '50%', en: '50%' }, { ru: 'Старт работ', en: 'Kick-off' }, { ru: 'Фиксируем объём и цену в переписке, я начинаю разработку.', en: 'We fix scope and price in writing, and I start building.' }],
              [{ ru: '50%', en: '50%' }, { ru: 'Сдача проекта', en: 'Delivery' }, { ru: 'Проверяете готовый сайт, вносим правки и публикуем.', en: 'You review the finished site, we make edits and publish.' }],
            ].map(([a, b, c], i) => (
              <div key={i} className="paystep reveal" style={{ '--i': i } as CSSProperties}>
                <b className="paystep-num">{t(a as L)}</b><h3>{t(b as L)}</h3><p className="muted">{t(c as L)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap pc-section" id="faq">
          <div className="section-head"><h2>{t({ ru: 'Частые вопросы', en: 'FAQ' })}</h2></div>
          <div className="faq">
            {faqs.map(([q, a], i) => (
              <div key={i} className={`faq-item${faq === i ? ' open' : ''}`}>
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  <span>{t(q)}</span><span className="faq-plus" aria-hidden="true" />
                </button>
                <div className="faq-body"><p className="muted">{t(a)}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap pc-final reveal">
          <h2>{t({ ru: 'Не нашли, что нужно?', en: 'Didn’t find what you need?' })}</h2>
          <p className="muted">{t({ ru: 'Опишите задачу своими словами — посчитаю вручную и предложу варианты.', en: 'Describe it in your own words — I’ll estimate it by hand and suggest options.' })}</p>
          <div className="pc-final-btns">
            <a className="btn btn-primary btn-lg" href={TELEGRAM} target="_blank" rel="noreferrer">{t({ ru: 'Написать в Telegram', en: 'Message on Telegram' })} <Icon name="arrow" /></a>
            <a className="btn btn-ghost btn-lg" href="./#work">{t({ ru: 'Посмотреть работы', en: 'See my work' })}</a>
          </div>
        </section>
      </main>

      {/* only visible when printing / saving as PDF */}
      <article className="print-doc" aria-hidden="true">
        <header className="pd-head">
          <div><b className="pd-logo">lovlyDev</b><span>{t({ ru: 'Артём — разработка сайтов и приложений', en: 'Artem — websites and apps' })}</span></div>
          <div className="pd-meta">
            <b>{t({ ru: 'Предварительная смета', en: 'Preliminary estimate' })}</b>
            <span>{new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>
        <section className="pd-summary">
          <div><span>{t({ ru: 'Проект', en: 'Project' })}</span><b>{t(kind.title)}</b></div>
          <div><span>{t({ ru: 'Объём', en: 'Size' })}</span><b>{t(units(kind, s.pages))}</b></div>
          <div><span>{t({ ru: 'Дизайн', en: 'Design' })}</span><b>{t(designs.find(d => d.id === s.design)!.title)}</b></div>
          <div><span>{t({ ru: 'Срок', en: 'Timeline' })}</span><b>~{est.days} {t({ ru: 'раб. дней', en: 'working days' })}</b></div>
        </section>
        <table className="pd-table">
          <thead><tr><th>{t({ ru: 'Работа', en: 'Item' })}</th><th>{t({ ru: 'Стоимость', en: 'Price' })}</th></tr></thead>
          <tbody>{est.lines.map(l => <tr key={l.label.ru}><td>{t(l.label)}</td><td>{l.price < 0 ? '−' + rub(-l.price) : rub(l.price)}</td></tr>)}</tbody>
          <tfoot><tr><td>{t({ ru: 'Итого', en: 'Total' })}</td><td>{rub(est.total)}</td></tr></tfoot>
        </table>
        <section className="pd-pay">
          <div><span>{t({ ru: 'Предоплата 50%', en: 'Upfront 50%' })}</span><b>{rub(Math.round(est.total / 2 / 100) * 100)}</b></div>
          <div><span>{t({ ru: 'После сдачи 50%', en: 'On delivery 50%' })}</span><b>{rub(est.total - Math.round(est.total / 2 / 100) * 100)}</b></div>
          {est.monthly > 0 && <div><span>{t({ ru: 'Поддержка', en: 'Support' })}</span><b>{rub(est.monthly)}{t({ ru: '/мес', en: '/mo' })}</b></div>}
          <div><span>{t({ ru: 'Вилка', en: 'Range' })}</span><b>{rub(est.low)} — {rub(est.high)}</b></div>
        </section>
        <p className="pd-note">{t({ ru: 'Смета предварительная и рассчитана автоматически. Точную стоимость и сроки фиксируем после короткого обсуждения задачи.', en: 'This estimate is preliminary and automatic. Exact price and timeline are fixed after a short chat about the task.' })}</p>
        <footer className="pd-foot">
          <span>Telegram: @lovlyswag</span><span>lovlydev.github.io</span>
        </footer>
      </article>

      <footer className="footer wrap mono muted">
        <span>© {new Date().getFullYear()} {t({ ru: 'Артём', en: 'Artem' })} / lovlyDev</span>
        <a href="./">{t({ ru: 'На главную', en: 'Home' })} ↑</a>
      </footer>

      <div className={`pc-toast${toast ? ' on' : ''}`} role="status">{toast}</div>
      <div className="pc-mbar">
        <span><b>{rub(Math.round(total / 100) * 100)}</b><small className="mono">~{Math.round(days)} {t({ ru: 'дн.', en: 'd' })}</small></span>
        <button className="btn btn-primary btn-sm" onClick={sendTelegram}>{t({ ru: 'Обсудить', en: 'Discuss' })}</button>
      </div>
    </>
  );
}
