import type { L } from '../i18n';

export const TELEGRAM = 'https://t.me/lovlyswag';

export const links: { label: string; handle: string; href: string }[] = [
  { label: 'Telegram', handle: '@lovlyswag', href: TELEGRAM },
  { label: 'GitHub', handle: 'lovlyDev', href: 'https://github.com/lovlyDev' },
  { label: 'X', handle: '@whylovly_god', href: 'https://x.com/whylovly_god' },
  { label: 'dev.to', handle: 'lovlydev', href: 'https://dev.to/lovlydev' },
  { label: 'Gravatar', handle: 'lovlydev', href: 'https://gravatar.com/lovlydev' },
];

const same = (s: string): L => ({ ru: s, en: s });

export const stack: { title: L; items: L }[] = [
  { title: { ru: 'Основное', en: 'Primary' }, items: same('C++, Rust, TypeScript, React, JavaScript, CSS, Git') },
  { title: { ru: 'Также', en: 'Also' }, items: same('PowerShell, Go, Python') },
  { title: { ru: 'Roblox', en: 'Roblox' }, items: { ru: 'Luau, VFX, игровые механики', en: 'Luau, VFX, game mechanics' } },
  { title: { ru: 'Базы данных', en: 'Databases' }, items: same('PostgreSQL, SQLite, MySQL') },
  { title: { ru: 'ИИ', en: 'AI' }, items: { ru: 'автоматизация, LLM-агенты в продуктах', en: 'automation, LLM agents inside products' } },
];

export const services: { title: L; text: L; tags: string[] }[] = [
  {
    tags: ['Landing', 'Portfolio', 'SEO', 'Responsive'],
    title: { ru: 'Сайты', en: 'Websites' },
    text: {
      ru: 'Лендинги, сайты компаний и портфолио. Быстрые, адаптивные, с аккуратной вёрсткой и базовым SEO.',
      en: 'Landing pages, company sites and portfolios. Fast, responsive, carefully built, with SEO basics.',
    },
  },
  {
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    title: { ru: 'Веб-приложения', en: 'Web applications' },
    text: {
      ru: 'Личные кабинеты, админ-панели, сервисы и соцсети — с базой данных и обновлениями в реальном времени.',
      en: 'Dashboards, admin panels, services and social apps — with a database and realtime updates.',
    },
  },
  {
    tags: ['Tauri', 'Rust', 'C++', 'Auto-update'],
    title: { ru: 'Десктоп-приложения', en: 'Desktop applications' },
    text: {
      ru: 'Программы для Windows, macOS и Linux на Tauri + Rust/C++: лёгкие, быстрые, с автообновлением.',
      en: 'Windows, macOS and Linux apps on Tauri + Rust/C++: lightweight, fast, auto-updating.',
    },
  },
  {
    tags: ['Roblox Studio', 'Particles', 'Beams'],
    title: { ru: 'VFX для Roblox', en: 'Roblox VFX' },
    text: {
      ru: 'Эффекты способностей, ударов и катсцен: заряд, взрывы, ударные волны, работа камеры. Под стиль вашей игры.',
      en: 'Effects for abilities, hits and cutscenes: charge-ups, explosions, shockwaves, camera work. Matched to your game’s style.',
    },
  },
  {
    tags: ['Luau', 'Roblox Studio', 'Client / Server'],
    title: { ru: 'Скрипты для Roblox', en: 'Roblox scripts' },
    text: {
      ru: 'Игровые механики, способности, системы и интерфейсы на Luau — с разделением на клиент и сервер.',
      en: 'Game mechanics, abilities, systems and UI in Luau — properly split between client and server.',
    },
  },
  {
    tags: ['Scripts', 'API', 'LLM', 'Integrations'],
    title: { ru: 'Автоматизация и ИИ', en: 'Automation & AI' },
    text: {
      ru: 'Скрипты, интеграции и ИИ-функции, которые снимают рутину с вас или ваших пользователей.',
      en: 'Scripts, integrations and AI features that take routine off you or your users.',
    },
  },
];

export const steps: { title: L; text: L }[] = [
  { title: { ru: 'Заявка', en: 'Request' }, text: { ru: 'Пишете в Telegram, что нужно сделать', en: 'You tell me on Telegram what you need' } },
  { title: { ru: 'Обсуждение', en: 'Discussion' }, text: { ru: 'Уточняем задачу, сроки и стоимость', en: 'We agree on scope, timeline and price' } },
  { title: { ru: 'Разработка', en: 'Development' }, text: { ru: 'Показываю промежуточные результаты', en: 'I show progress along the way' } },
  { title: { ru: 'Запуск', en: 'Launch' }, text: { ru: 'Публикую проект и остаюсь на связи', en: 'I ship it and stay in touch' } },
];
