import type { L } from '../i18n';

export type Metric = { value: number; prefix?: string; suffix?: string; label: L };
export type Step = { title: L; text: L; shot: string; mobile?: boolean };
export type Review = { author: L; role: L; text: L };

export type Case = {
  id: string;
  name: L;
  kind: L;
  period: L;
  accent: string;
  logo?: string;
  intro: L;
  role: L;
  metrics: Metric[];
  stack: string[];
  steps: Step[];
  features: L[];
  /** what the client paid for the project */
  price: L;
  links?: { label: L; href: string }[];
  nda?: L;
  /** real client reviews only; the block is hidden while this is empty */
  reviews: Review[];
};

const shot = (id: string, name: string) => `./cases/${id}/${name}.webp`;

export const cases: Case[] = [
  {
    id: 'cardly',
    name: { ru: 'Cardly', en: 'Cardly' },
    kind: { ru: 'Telegram Mini App · коллекционные карты', en: 'Telegram Mini App · collectible cards' },
    period: { ru: 'Октябрь 2026 · запущен', en: 'October 2026 · live' },
    accent: '#4fe0a1',
    logo: './cases/cardly/logo.svg',
    intro: {
      ru: 'Игра-коллекция прямо в Telegram: игрок открывает карты с уникальными 16-значными номерами, собирает редкие материалы, выполняет задания и покупает улучшения за Telegram Stars.',
      en: 'A collecting game right inside Telegram: players open cards with unique 16-digit numbers, hunt for rare materials, complete tasks and buy upgrades with Telegram Stars.',
    },
    role: { ru: 'Сделал с нуля в одиночку: интерфейс, фронтенд, сервер, бот, экономика, деплой', en: 'Built from scratch on my own: UI, frontend, server, bot, economy and deployment' },
    metrics: [
      { value: 136, label: { ru: 'игроков при запуске', en: 'players at launch' } },
      { value: 1756, label: { ru: 'карт открыто', en: 'cards opened' } },
      { value: 11, prefix: '×', label: { ru: 'ускорение API', en: 'faster API' } },
      { value: 159, label: { ru: 'автотестов', en: 'automated tests' } },
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Fastify', 'PostgreSQL', 'Prisma', 'grammY', 'WebGL shaders', 'Docker'],
    steps: [
      {
        title: { ru: 'Открытие карты', en: 'Opening a card' },
        text: { ru: 'Карта раскрывается прямо на главном экране: номер прокручивается барабаном, материал переливается шейдером на видеокарте, без всплывающих окон.', en: 'The card reveals in place on the main screen: the number rolls like a reel and the material shimmers with a GPU shader, no pop-ups.' },
        shot: shot('cardly', 'm-result'), mobile: true,
      },
      {
        title: { ru: '10 материалов', en: '10 materials' },
        text: { ru: 'Золото, платина, голография, карбон и другие — у каждого свой эффект. Если WebGL недоступен или включена экономия, остаётся аккуратная SVG-версия.', en: 'Gold, platinum, holographic, carbon and more, each with its own effect. Without WebGL or in low-power mode a clean SVG version remains.' },
        shot: shot('cardly', 'm-after'), mobile: true,
      },
      {
        title: { ru: 'Коллекция и оценка', en: 'Collection and valuation' },
        text: { ru: 'Каждая карта получает серверную оценку: база серии, множитель номера, рыночная поправка. Номера уникальны для всех игроков навсегда.', en: 'Every card gets a server-side valuation: series base, number multiplier and market adjustment. Numbers are unique across all players forever.' },
        shot: shot('cardly', 'm-collection'), mobile: true,
      },
      {
        title: { ru: 'Магазин за Telegram Stars', en: 'Telegram Stars shop' },
        text: { ru: 'Покупка выдаётся только после подтверждения оплаты от самого Telegram — браузеру сервер не доверяет. Слоты хранилища, усиления, оформление.', en: 'Purchases are delivered only after Telegram itself confirms payment; the server never trusts the browser. Storage slots, boosts, cosmetics.' },
        shot: shot('cardly', 'm-shop'), mobile: true,
      },
      {
        title: { ru: 'Профиль и прогресс', en: 'Profile and progress' },
        text: { ru: 'Уровни, статистика, лучший дроп, распределение редкостей, ежедневные задания и рефералы держат игроков в приложении.', en: 'Levels, stats, best drop, rarity breakdown, daily tasks and referrals keep players coming back.' },
        shot: shot('cardly', 'm-profile'), mobile: true,
      },
    ],
    features: [
      { ru: 'Честная генерация номеров через криптографический генератор', en: 'Fair number generation with a cryptographic RNG' },
      { ru: 'Экономика с аудитом вероятностей, стоимости и наград', en: 'Economy with audited probabilities, values and rewards' },
      { ru: 'Проверка подписки на канал и подписи данных Telegram на сервере', en: 'Server-side channel membership and Telegram signature checks' },
      { ru: 'Админ-бот, уведомления, бонусное колесо, альбомы', en: 'Admin bot, notifications, bonus wheel, albums' },
      { ru: 'Деплой на VPS в Docker, бэкапы, мониторинг', en: 'VPS deployment in Docker, backups, monitoring' },
      { ru: 'Ответ главного API ускорен с 2,9 до 0,29 секунды', en: 'Main API response cut from 2.9 to 0.29 seconds' },
    ],
    price: { ru: '320 000 ₽', en: '320,000 ₽' },
    links: [
      { label: { ru: 'Открыть бота', en: 'Open the bot' }, href: 'https://t.me/kartochk1nbot' },
      { label: { ru: 'Канал проекта', en: 'Project channel' }, href: 'https://t.me/kartochk1n' },
    ],
    reviews: [
      {
        author: { ru: 'Заказчик', en: 'Client' }, role: { ru: 'владелец проекта', en: 'project owner' },
        text: {
          ru: 'Слушай, хотел отдельно поблагодарить за проект. Результат реально порадовал, всё работает как надо, интерфейс получился даже лучше, чем изначально представляли. Отдельный плюс за то, что всегда был на связи и быстро вносил правки. С тобой комфортно работать, поэтому следующие задачи тоже планируем отдавать тебе. Надеюсь, продолжим сотрудничество!',
          en: 'Wanted to thank you separately for the project. The result really pleased us: everything works as it should and the interface came out even better than we first imagined. A special plus for always being in touch and making changes quickly. You are comfortable to work with, so we plan to give you our next tasks too. Hope we keep working together!',
        },
      },
    ],
  },
  {
    id: 'partyup',
    name: { ru: 'Платформа поиска тиммейтов', en: 'Teammate-finding platform' },
    kind: { ru: 'Веб-платформа · под NDA', en: 'Web platform · under NDA' },
    period: { ru: 'Июль 2026 · проект закрыт', en: 'July 2026 · project closed' },
    accent: '#8b6cff',
    intro: {
      ru: 'Сервис, где игроки находят напарников по игре, рангу, роли, расписанию и стилю общения, собирают группы и постоянные команды.',
      en: 'A service where players find teammates by game, rank, role, schedule and communication style, then form groups and permanent teams.',
    },
    role: { ru: 'Сделал с нуля по 13 техническим заданиям: сервер, фоновые задачи, сайт и админ-панель', en: 'Built from scratch to 13 specifications: server, background jobs, website and admin panel' },
    metrics: [
      { value: 116, label: { ru: 'эндпоинтов API', en: 'API endpoints' } },
      { value: 57, label: { ru: 'таблиц в базе', en: 'database tables' } },
      { value: 13, label: { ru: 'технических заданий', en: 'specifications' } },
      { value: 32, label: { ru: 'файла тестов', en: 'test files' } },
    ],
    stack: ['Next.js 16', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'OpenAPI', 'Docker'],
    steps: [
      {
        title: { ru: 'Быстрый старт', en: 'Quick start' },
        text: { ru: 'Главная сразу предлагает три действия: выбрать игру, найти группу на вечер или искать игроков. Рекомендации учитывают профиль.', en: 'The home screen offers three actions at once: pick a game, find a group for tonight or search players. Recommendations use the profile.' },
        shot: shot('partyup', 'd-dashboard'),
      },
      {
        title: { ru: 'Поиск игроков', en: 'Player search' },
        text: { ru: 'Фильтры по игре, платформе, региону, языку, голосу и свободному времени. Приватные поля скрыты настройками приватности игрока.', en: 'Filters by game, platform, region, language, voice and free time. Private fields stay hidden by each player’s privacy settings.' },
        shot: shot('partyup', 'd-search'),
      },
      {
        title: { ru: 'Заявки на игру', en: 'Game requests' },
        text: { ru: 'Игрок публикует заявку с ролями и рангом — движок подбора сам предлагает подходящих людей и объясняет, почему они подходят.', en: 'A player posts a request with roles and rank; the matching engine suggests fitting people and explains why they fit.' },
        shot: shot('partyup', 'd-lfg-detail'),
      },
      {
        title: { ru: 'Расписание', en: 'Schedule' },
        text: { ru: 'Регулярные интервалы и исключения в своём часовом поясе — пересечения времени считаются автоматически.', en: 'Recurring slots and exceptions in your own time zone; overlaps are computed automatically.' },
        shot: shot('partyup', 'd-schedule'),
      },
      {
        title: { ru: 'Команды', en: 'Teams' },
        text: { ru: 'Постоянные составы с ролями, заявками на вступление и приглашениями.', en: 'Permanent rosters with roles, join applications and invitations.' },
        shot: shot('partyup', 'd-teams'),
      },
    ],
    features: [
      { ru: 'Вход через Discord OAuth2 с PKCE, без хранения токенов в браузере', en: 'Discord OAuth2 sign-in with PKCE, no tokens stored in the browser' },
      { ru: 'Ротация refresh-токенов с защитой от повторного использования', en: 'Rotating refresh tokens with reuse detection' },
      { ru: 'Движок подбора: заявка → игроки, игрок → игроки, игрок → заявки', en: 'Matching engine: request → players, player → players, player → requests' },
      { ru: 'Модерация: жалобы с доказательствами, блокировки', en: 'Moderation: reports with evidence, blocks' },
      { ru: 'Админ-панель с подтверждением TOTP', en: 'Admin panel with TOTP confirmation' },
      { ru: 'Контракты OpenAPI и Swagger для всего API', en: 'OpenAPI contracts and Swagger for the whole API' },
    ],
    price: { ru: '470 000 ₽', en: '470,000 ₽' },
    nda: {
      ru: 'Заказчик попросил не раскрывать название продукта и владельца, поэтому на скриншотах они скрыты. По моим данным, проект уже закрыт. Экраны сняты на локальной копии с тестовыми данными.',
      en: 'The client asked not to disclose the product name or owner, so both are hidden in the screenshots. As far as I know, the project is now closed. Screens were captured from a local copy with test data.',
    },
    reviews: [
      {
        author: { ru: 'Заказчик', en: 'Client' }, role: { ru: 'имя скрыто по NDA', en: 'name hidden under NDA' },
        text: {
          ru: 'Привет! Посмотрели финальную версию, всё отлично получилось. Особенно понравилось, что ты учёл все наши пожелания и даже предложил несколько решений, о которых мы сами не подумали. Сайт работает быстро, выглядит аккуратно, никаких проблем пока не заметили. Спасибо за работу! Думаю, на этом не остановимся, у нас уже есть идеи для следующего проекта, так что будем обращаться ещё)',
          en: 'Hi! We looked at the final version and everything turned out great. We especially liked that you took all our wishes into account and even suggested a few solutions we had not thought of. The site is fast, looks neat, and we have not noticed any problems so far. Thanks for the work! We won’t stop here, we already have ideas for the next project, so we’ll be back :)',
        },
      },
    ],
  },
];
