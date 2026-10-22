import type { L } from '../i18n';

/*
 * All prices and timings of the calculator live here. Prices are in roubles, days are working days.
 * Change the numbers freely — the page recalculates from this file.
 */

export type Kind = {
  id: string;
  title: L;
  text: L;
  base: number;
  /** pages (or screens) already included in the base price */
  included: number;
  /** price of every extra page or screen */
  perPage: number;
  days: number;
  /** ru: one / few / many; en: one / many */
  unit: { ru: [string, string, string]; en: [string, string] };
  maxPages: number;
};

const PAGES: Kind['unit'] = { ru: ['страница', 'страницы', 'страниц'], en: ['page', 'pages'] };
const SCREENS: Kind['unit'] = { ru: ['экран', 'экрана', 'экранов'], en: ['screen', 'screens'] };

/** "5 страниц", "2 pages" */
export function units(k: Kind, n: number): L {
  const m10 = n % 10, m100 = n % 100;
  const ru = m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 1 : 2;
  return { ru: `${n} ${k.unit.ru[ru]}`, en: `${n} ${k.unit.en[n === 1 ? 0 : 1]}` };
}

export const kinds: Kind[] = [
  { id: 'landing', title: { ru: 'Лендинг', en: 'Landing page' }, text: { ru: 'Одна страница: услуги, цены, контакты, карта и кнопка записи.', en: 'One page: services, prices, contacts, map and a booking button.' }, base: 10_000, included: 1, perPage: 2_500, days: 5, unit: PAGES, maxPages: 3 },
  { id: 'business', title: { ru: 'Сайт компании', en: 'Company website' }, text: { ru: 'Несколько страниц: главная, услуги, о компании, контакты.', en: 'Several pages: home, services, about, contacts.' }, base: 20_000, included: 4, perPage: 2_500, days: 10, unit: PAGES, maxPages: 15 },
  { id: 'catalog', title: { ru: 'Каталог или магазин', en: 'Catalog or shop' }, text: { ru: 'Товары или услуги с фильтрами, карточками и корзиной заявок.', en: 'Products or services with filters, cards and a request cart.' }, base: 35_000, included: 5, perPage: 3_000, days: 15, unit: PAGES, maxPages: 20 },
  { id: 'webapp', title: { ru: 'Веб-сервис', en: 'Web service' }, text: { ru: 'Личный кабинет, админка, база данных и обновления в реальном времени.', en: 'User accounts, admin panel, database and realtime updates.' }, base: 60_000, included: 5, perPage: 5_000, days: 25, unit: SCREENS, maxPages: 30 },
  { id: 'desktop', title: { ru: 'Десктоп-приложение', en: 'Desktop app' }, text: { ru: 'Программа для Windows, macOS и Linux на Tauri + Rust с автообновлением.', en: 'An app for Windows, macOS and Linux on Tauri + Rust with auto-updates.' }, base: 80_000, included: 5, perPage: 6_000, days: 30, unit: SCREENS, maxPages: 30 },
];

export type Option = { id: string; title: L; text: L; mult: number; days: number };

export const designs: Option[] = [
  { id: 'clean', title: { ru: 'Аккуратный', en: 'Clean' }, text: { ru: 'Проверенная структура, ваши цвета и шрифты.', en: 'Proven structure in your colours and fonts.' }, mult: 1, days: 0 },
  { id: 'custom', title: { ru: 'Индивидуальный', en: 'Custom' }, text: { ru: 'Свой стиль под бизнес, как у концептов в портфолио.', en: 'A style of its own, like the portfolio concepts.' }, mult: 1.25, days: 3 },
  { id: 'motion', title: { ru: 'С анимациями', en: 'Motion-rich' }, text: { ru: 'Как этот сайт: прокрутка, 3D, живые элементы.', en: 'Like this site: scroll effects, 3D, live details.' }, mult: 1.5, days: 6 },
];

export type Feature = { id: string; title: L; text: L; price: number; days: number; for?: string[] };

export const features: Feature[] = [
  { id: 'tg', title: { ru: 'Заявки в Telegram', en: 'Requests to Telegram' }, text: { ru: 'Форма отправляет заявку вам в чат за секунду.', en: 'A form that drops requests into your chat instantly.' }, price: 2_000, days: 1 },
  { id: 'booking', title: { ru: 'Онлайн-запись', en: 'Online booking' }, text: { ru: 'Клиент выбирает услугу, день и свободное время.', en: 'Clients pick a service, a day and a free slot.' }, price: 6_000, days: 3 },
  { id: 'calc', title: { ru: 'Прайс или калькулятор', en: 'Price list or calculator' }, text: { ru: 'Вкладки с ценами или расчёт стоимости, как этот.', en: 'Tabbed prices or an estimate, like this one.' }, price: 4_000, days: 2 },
  { id: 'gallery', title: { ru: 'Галерея и отзывы', en: 'Gallery and reviews' }, text: { ru: 'Фото работ, слайдер и отзывы с Яндекс Карт.', en: 'Work photos, a slider and Yandex Maps reviews.' }, price: 2_500, days: 1 },
  { id: 'anim', title: { ru: 'Анимации при прокрутке', en: 'Scroll animations' }, text: { ru: 'Появление блоков, параллакс, счётчики.', en: 'Reveals, parallax, counters.' }, price: 5_000, days: 2 },
  { id: 'lang', title: { ru: 'Второй язык', en: 'Second language' }, text: { ru: 'Переключатель языка, как здесь сверху.', en: 'A language switch, like the one up top.' }, price: 5_000, days: 2 },
  { id: 'blog', title: { ru: 'Блог или новости', en: 'Blog or news' }, text: { ru: 'Раздел со статьями — полезно для поиска.', en: 'An articles section — good for search.' }, price: 6_000, days: 3 },
  { id: 'admin', title: { ru: 'Админка', en: 'Admin panel' }, text: { ru: 'Меняете цены, фото и тексты сами, без меня.', en: 'Edit prices, photos and text yourself.' }, price: 12_000, days: 5 },
  { id: 'pay', title: { ru: 'Онлайн-оплата', en: 'Online payment' }, text: { ru: 'Оплата картой или по СБП прямо на сайте.', en: 'Card or SBP payments on the site.' }, price: 10_000, days: 4 },
  { id: 'cabinet', title: { ru: 'Личный кабинет', en: 'User accounts' }, text: { ru: 'Вход, история заказов, профиль.', en: 'Sign-in, order history, profile.' }, price: 15_000, days: 6 },
  { id: 'crm', title: { ru: 'Интеграция с CRM', en: 'CRM integration' }, text: { ru: 'Заявки уходят в amoCRM, Битрикс24 или таблицу.', en: 'Requests go to amoCRM, Bitrix24 or a sheet.' }, price: 6_000, days: 2 },
  { id: 'ai', title: { ru: 'ИИ-помощник', en: 'AI assistant' }, text: { ru: 'Отвечает на частые вопросы клиентов.', en: 'Answers your clients’ common questions.' }, price: 12_000, days: 4 },
];

export type Extra = { id: string; title: L; options: { id: string; title: L; price: number; days: number }[] };

export const extras: Extra[] = [
  { id: 'texts', title: { ru: 'Тексты', en: 'Copy' }, options: [
    { id: 'have', title: { ru: 'Есть свои', en: 'I have them' }, price: 0, days: 0 },
    { id: 'me', title: { ru: 'Напишите вы', en: 'You write them' }, price: 3_000, days: 2 },
  ] },
  { id: 'photos', title: { ru: 'Фото', en: 'Photos' }, options: [
    { id: 'have', title: { ru: 'Есть свои', en: 'I have them' }, price: 0, days: 0 },
    { id: 'stock', title: { ru: 'Подберите сток', en: 'Pick stock photos' }, price: 1_500, days: 1 },
  ] },
  { id: 'logo', title: { ru: 'Логотип', en: 'Logo' }, options: [
    { id: 'have', title: { ru: 'Есть', en: 'I have one' }, price: 0, days: 0 },
    { id: 'new', title: { ru: 'Нужен новый', en: 'Need a new one' }, price: 5_000, days: 3 },
  ] },
  { id: 'domain', title: { ru: 'Адрес сайта', en: 'Address' }, options: [
    { id: 'free', title: { ru: 'Бесплатный', en: 'Free subdomain' }, price: 0, days: 0 },
    { id: 'own', title: { ru: 'Свой домен', en: 'Own domain' }, price: 500, days: 0 },
  ] },
];

export const speeds: Option[] = [
  { id: 'calm', title: { ru: 'Не спешим', en: 'No rush' }, text: { ru: '−10% к цене, срок ×1,5', en: '−10% price, 1.5× time' }, mult: .9, days: 1.5 },
  { id: 'normal', title: { ru: 'Обычно', en: 'Standard' }, text: { ru: 'Обычный темп', en: 'Normal pace' }, mult: 1, days: 1 },
  { id: 'fast', title: { ru: 'Срочно', en: 'Rush' }, text: { ru: '+30% к цене, срок ×0,6', en: '+30% price, 0.6× time' }, mult: 1.3, days: .6 },
];

/** monthly support after the free first month */
export const supports = [
  { id: 'none', title: { ru: 'Только первый месяц', en: 'First month only' }, monthly: 0 },
  { id: 'basic', title: { ru: 'Правки и обновления', en: 'Edits and updates' }, monthly: 2_000 },
  { id: 'full', title: { ru: 'Сопровождение', en: 'Full care' }, monthly: 5_000 },
];

export type State = { kind: string; pages: number; design: string; feats: string[]; extras: Record<string, string>; speed: string; support: string };

export const defaultState: State = { kind: 'landing', pages: 1, design: 'clean', feats: ['tg'], extras: { texts: 'have', photos: 'have', logo: 'have', domain: 'free' }, speed: 'normal', support: 'none' };

export const presets: { id: string; title: L; text: L; state: Partial<State> }[] = [
  { id: 'card', title: { ru: 'Визитка для мастера', en: 'Card for a freelancer' }, text: { ru: 'Барбер, фотограф, репетитор', en: 'Barber, photographer, tutor' }, state: { kind: 'landing', pages: 1, design: 'clean', feats: ['tg', 'gallery'] } },
  { id: 'local', title: { ru: 'Сайт для автосервиса', en: 'Car service site' }, text: { ru: 'Услуги, цены, запись, карта', en: 'Services, prices, booking, map' }, state: { kind: 'landing', pages: 1, design: 'custom', feats: ['tg', 'calc', 'gallery'] } },
  { id: 'clinic', title: { ru: 'Клиника или салон', en: 'Clinic or salon' }, text: { ru: 'Врачи, прайс, онлайн-запись', en: 'Staff, prices, online booking' }, state: { kind: 'business', pages: 5, design: 'custom', feats: ['tg', 'booking', 'calc', 'gallery'] } },
  { id: 'shop', title: { ru: 'Магазин', en: 'Shop' }, text: { ru: 'Каталог, корзина, оплата', en: 'Catalog, cart, payment' }, state: { kind: 'catalog', pages: 8, design: 'custom', feats: ['tg', 'pay', 'admin', 'gallery'] } },
  { id: 'saas', title: { ru: 'Сервис с кабинетом', en: 'Service with accounts' }, text: { ru: 'Кабинет, админка, база', en: 'Accounts, admin, database' }, state: { kind: 'webapp', pages: 8, design: 'custom', feats: ['cabinet', 'admin', 'tg'] } },
];

export type Line = { label: L; price: number };

export function estimate(s: State) {
  const kind = kinds.find(k => k.id === s.kind) ?? kinds[0];
  const design = designs.find(d => d.id === s.design) ?? designs[0];
  const speed = speeds.find(x => x.id === s.speed) ?? speeds[1];
  const support = supports.find(x => x.id === s.support) ?? supports[0];
  const lines: Line[] = [];
  let days = kind.days;

  lines.push({ label: kind.title, price: kind.base });
  const extraPages = Math.max(0, s.pages - kind.included);
  if (extraPages) {
    const u = units(kind, extraPages);
    lines.push({ label: { ru: `Ещё ${u.ru}`, en: `${u.en} more` }, price: extraPages * kind.perPage });
    days += extraPages * .5;
  }
  const subtotal = lines.reduce((a, l) => a + l.price, 0);
  if (design.mult !== 1) lines.push({ label: { ru: `Дизайн: ${design.title.ru.toLowerCase()}`, en: `Design: ${design.title.en.toLowerCase()}` }, price: Math.round(subtotal * (design.mult - 1)) });
  days += design.days;

  for (const f of features) if (s.feats.includes(f.id)) { lines.push({ label: f.title, price: f.price }); days += f.days; }
  for (const e of extras) {
    const o = e.options.find(x => x.id === s.extras[e.id]);
    if (o && o.price) { lines.push({ label: { ru: `${e.title.ru}: ${o.title.ru.toLowerCase()}`, en: `${e.title.en}: ${o.title.en.toLowerCase()}` }, price: o.price }); days += o.days; }
  }
  let total = lines.reduce((a, l) => a + l.price, 0);
  if (speed.mult !== 1) {
    const delta = Math.round(total * (speed.mult - 1));
    lines.push({ label: { ru: `Сроки: ${speed.title.ru.toLowerCase()}`, en: `Timeline: ${speed.title.en.toLowerCase()}` }, price: delta });
    total += delta;
  }
  total = Math.round(total / 500) * 500;
  days = Math.max(2, Math.round(days * speed.days));
  return { lines, total, low: Math.round(total * .9 / 500) * 500, high: Math.round(total * 1.15 / 500) * 500, days, monthly: support.monthly, kind };
}
