import type { L } from '../i18n';

export type Project = {
  id: string;
  name: string;
  version: string;
  kind: L;
  platforms: string;
  tagline: L;
  about: L;
  /** how it is built — concrete engineering, not marketing */
  engineering: L[];
  stack: string[];
  /** approximate lines of source code */
  loc: number;
  /** language share from GitHub, percent; small ones folded into "Other" */
  langs: [string, number][];
  /** screenshot captions, in order of public/shots/<id>/NN.{avif,webp} */
  shots: L[];
  links: { label: L; href: string }[];
};

const gh = (repo: string) => `https://github.com/lovlyDev/${repo}`;
/** path without extension; each screenshot exists as .avif and .webp */
export const shotBase = (id: string, i: number) => `./shots/${id}/${String(i + 1).padStart(2, '0')}`;

export const projects: Project[] = [
  {
    id: 'forma',
    name: 'Forma CAD',
    version: '1.3.0',
    kind: { ru: 'Десктоп-приложение', en: 'Desktop app' },
    platforms: 'Windows, macOS, Linux',
    tagline: {
      ru: 'CAD, в котором деталь можно описать словами — ИИ меняет модель, Forma проверяет геометрию.',
      en: 'A CAD where you describe a part in words — AI edits the model, Forma validates the geometry.',
    },
    about: {
      ru: 'Локальная CAD-среда для мейкеров и инженеров: ручное моделирование и ИИ-агенты работают над одной моделью, каждая правка сохраняется ревизией, которую можно сравнить и откатить.',
      en: 'A local CAD workspace for makers and engineers: manual modelling and AI agents work on the same model, and every change is saved as a revision you can diff and roll back.',
    },
    engineering: [
      { ru: 'Свой формат CAD IR v2: именованные параметры и тела, история операций, подавление и откат.', en: 'Custom CAD IR v2: named parameters and bodies, feature history, suppression and rollback.' },
      { ru: 'Точная геометрия на C++ и OpenCascade, бэкенд на Rust, 3D-вьюер на Three.js.', en: 'Exact geometry in C++ and OpenCascade, Rust backend, Three.js viewer.' },
      { ru: 'Codex, Claude или свой CLI работают через систему разрешений, результат проверяется локально.', en: 'Codex, Claude or a custom CLI work through a permission system; results are validated locally.' },
      { ru: 'Импорт STEP, экспорт в STEP, STL, OBJ, GLB, 3MF. Подписанные автообновления.', en: 'STEP import; STEP, STL, OBJ, GLB, 3MF export. Signed auto-updates.' },
    ],
    stack: ['Rust', 'C++', 'OpenCascade', 'Tauri', 'React', 'Three.js', 'TypeScript', 'Python'],
    loc: 53_000,
    langs: [['Rust', 47.7], ['TypeScript', 39.6], ['C++', 6.1], ['CSS', 3.6], ['Other', 3.0]],
    shots: [
      { ru: 'Модель, дерево и ИИ-ассистент', en: 'Model, tree and AI assistant' },
      { ru: 'Рабочее пространство', en: 'Workspace' },
      { ru: 'Сравнение ревизий', en: 'Revision compare' },
      { ru: 'Экспорт', en: 'Export' },
      { ru: 'Настройки: ИИ-агенты', en: 'Settings: AI agents' },
      { ru: 'Настройки: CAD-окружение', en: 'Settings: CAD environment' },
      { ru: 'Настройки: разрешения', en: 'Settings: permissions' },
      { ru: 'Настройки: внешний вид', en: 'Settings: appearance' },
      { ru: 'Настройки: конфиденциальность', en: 'Settings: privacy' },
    ],
    links: [
      { label: { ru: 'Релизы', en: 'Releases' }, href: `${gh('FormaCAD')}/releases` },
      { label: { ru: 'Код', en: 'Source' }, href: gh('FormaCAD') },
    ],
  },
  {
    id: 'vantix',
    name: 'VANTIX',
    version: '0.1.0',
    kind: { ru: 'Десктоп-приложение', en: 'Desktop app' },
    platforms: 'Windows, Linux',
    tagline: {
      ru: 'Генератор именных TON-адресов на CPU и GPU и рабочее место TON-разработчика.',
      en: 'Vanity TON address generator on CPU and GPU, plus a workspace for TON developers.',
    },
    about: {
      ru: 'Подбирает адрес кошелька с нужным словом и делает это полностью локально — ключи не покидают компьютер. Вокруг ядра — 13 инструментов: проверка кошельков и адресов, транзакции, BOC Explorer, контракты, песочница и сборка контрактов на Tolk.',
      en: 'Finds a wallet address containing the word you want, fully locally — keys never leave the machine. Around the core are 13 tools: wallet and address checks, transactions, BOC Explorer, contracts, a sandbox and a Tolk contract builder.',
    },
    engineering: [
      { ru: 'Вычислительное ядро на C++23: CPU-движок и GPU-движок на Vulkan Compute, шейдеры на Slang → SPIR-V.', en: 'C++23 compute core: a CPU engine and a Vulkan Compute GPU engine, shaders written in Slang → SPIR-V.' },
      { ru: '≈5 000 полных TON-адресов в секунду на домашнем ПК (12 потоков + RX 6650 XT).', en: '≈5,000 full TON addresses per second on a home PC (12 threads + RX 6650 XT).' },
      { ru: 'Самопроверка движков по эталонным векторам и автокалибровка: в работу идёт только проверенный и самый быстрый.', en: 'Engines are self-tested against reference vectors and auto-calibrated; only the verified fastest one runs.' },
      { ru: 'Оболочка на Tauri (Rust), ядро работает отдельным процессом, интерфейс — React + TypeScript.', en: 'Tauri (Rust) shell, the core runs as a sidecar process, UI in React + TypeScript.' },
    ],
    stack: ['C++23', 'Vulkan', 'Slang', 'Rust', 'Tauri', 'React', 'TypeScript', 'CMake'],
    loc: 13_000,
    langs: [['C++', 56.4], ['TypeScript', 13.8], ['CSS', 11.9], ['Slang', 7.8], ['Other', 10.1]],
    shots: [
      { ru: 'Поиск адреса: живой график скорости', en: 'Address search: live speed chart' },
      { ru: 'Обзор: устройства и последние инструменты', en: 'Overview: devices and recent tools' },
      { ru: 'Новый кошелёк', en: 'New wallet' },
      { ru: 'Проверка кошелька', en: 'Wallet check' },
      { ru: 'Проверка адреса', en: 'Address check' },
      { ru: 'Транзакции', en: 'Transactions' },
      { ru: 'BOC Explorer', en: 'BOC Explorer' },
      { ru: 'Контракты', en: 'Contracts' },
      { ru: 'Contract Vanity', en: 'Contract Vanity' },
      { ru: 'Sandbox: сценарии в песочнице TON', en: 'Sandbox: TON sandbox scenarios' },
      { ru: 'Builder: редактор контрактов на Tolk', en: 'Builder: Tolk contract editor' },
      { ru: 'GPU Benchmark', en: 'GPU Benchmark' },
      { ru: 'Developer CLI', en: 'Developer CLI' },
      { ru: 'Настройки', en: 'Settings' },
    ],
    links: [
      { label: { ru: 'Релизы', en: 'Releases' }, href: `${gh('VANTIX')}/releases` },
      { label: { ru: 'Код', en: 'Source' }, href: gh('VANTIX') },
    ],
  },
  {
    id: 'lume',
    name: 'LUME',
    version: 'web',
    kind: { ru: 'Веб-платформа', en: 'Web platform' },
    platforms: 'Web',
    tagline: {
      ru: 'Социальная сеть с мессенджером, группами, каналами, кошельком и модерацией.',
      en: 'A social network with messenger, groups, channels, a wallet and moderation.',
    },
    about: {
      ru: 'Полноценный продукт, а не макет: лента в реальном времени, личные чаты, группы и каналы, верификация пользователей, внутренняя валюта, воркспейсы для команд, админ-панель.',
      en: 'A real product, not a mock-up: realtime feed, direct messages, groups and channels, user verification, an in-app currency, team workspaces and an admin panel.',
    },
    engineering: [
      { ru: 'API на Node.js и Express, данные в PostgreSQL, часть логики — на PL/pgSQL.', en: 'Node.js + Express API, PostgreSQL storage, part of the logic in PL/pgSQL.' },
      { ru: 'Realtime через WebSocket с Redis-адаптером для работы нескольких инстансов.', en: 'Realtime over WebSocket with a Redis adapter for multiple instances.' },
      { ru: 'JWT и refresh-токены, роли и права, аудит действий, модерация контента.', en: 'JWT with refresh tokens, roles and permissions, audit log, content moderation.' },
      { ru: 'Поиск на Meilisearch, медиа через Cloudinary, интерфейс на трёх языках.', en: 'Meilisearch search, Cloudinary media, UI in three languages.' },
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'WebSocket'],
    loc: 50_000,
    langs: [['TypeScript', 68.2], ['JavaScript', 30.0], ['CSS', 1.0], ['PL/pgSQL', 0.7], ['Other', 0.1]],
    shots: [
      { ru: 'Главная страница', en: 'Landing page' },
      { ru: 'Лента', en: 'Feed' },
      { ru: 'Поиск', en: 'Search' },
      { ru: 'Проекты', en: 'Projects' },
      { ru: 'Воркспейсы', en: 'Workspaces' },
      { ru: 'Кошелёк', en: 'Wallet' },
      { ru: 'Онбординг', en: 'Onboarding' },
      { ru: 'Статус систем', en: 'System status' },
    ],
    links: [
      { label: { ru: 'Сайт', en: 'Website' }, href: 'https://lume-a7wc.vercel.app' },
      { label: { ru: 'Код', en: 'Source' }, href: gh('LUME') },
    ],
  },
  {
    id: 'pkgwise',
    name: 'PkgWise',
    version: '0.1.0-alpha.3',
    kind: { ru: 'CLI-инструмент', en: 'CLI tool' },
    platforms: 'npm, Node.js 22+',
    tagline: {
      ru: 'Объяснимый анализ зависимостей JavaScript и TypeScript проектов.',
      en: 'Explainable dependency analysis for JavaScript and TypeScript projects.',
    },
    about: {
      ru: 'Показывает, что на самом деле лежит в node_modules: граф зависимостей, дубликаты, циклы, проблемы lockfile — и объясняет, откуда взялась каждая оценка.',
      en: 'Shows what is really inside node_modules: the dependency graph, duplicates, cycles, lockfile problems — and explains where every score comes from.',
    },
    engineering: [
      { ru: 'Свои парсеры lockfile: npm v2/v3 и pnpm schema 6–9, монорепозитории и воркспейсы.', en: 'Own lockfile parsers: npm v2/v3 and pnpm schema 6–9, monorepos and workspaces.' },
      { ru: 'Граф с дубликатами версий, циклами и кратчайшими путями до любого пакета.', en: 'A graph with duplicate versions, cycles and shortest paths to any package.' },
      { ru: 'Детерминированные отчёты и стабильные fingerprint находок — подходит для CI.', en: 'Deterministic reports and stable finding fingerprints — CI-ready.' },
      { ru: 'Опубликован в npm, команды scan, inspect, compare, explain, doctor.', en: 'Published on npm with scan, inspect, compare, explain and doctor commands.' },
    ],
    stack: ['TypeScript', 'Node.js', 'pnpm'],
    loc: 10_000,
    langs: [['TypeScript', 96.9], ['JavaScript', 3.1]],
    shots: [
      { ru: 'pkgwise scan: сводка и оценки', en: 'pkgwise scan: summary and scores' },
      { ru: 'Находки с рекомендациями', en: 'Findings with recommendations' },
      { ru: 'pkgwise compare', en: 'pkgwise compare' },
      { ru: 'pkgwise inspect', en: 'pkgwise inspect' },
      { ru: 'pkgwise doctor', en: 'pkgwise doctor' },
    ],
    links: [
      { label: { ru: 'npm', en: 'npm' }, href: 'https://www.npmjs.com/package/pkgwise' },
      { label: { ru: 'Код', en: 'Source' }, href: gh('pkgWise') },
    ],
  },
  {
    id: 'branchly',
    name: 'Branchly',
    version: '0.1.0-alpha',
    kind: { ru: 'Десктоп-приложение', en: 'Desktop app' },
    platforms: 'Windows',
    tagline: {
      ru: 'Git-ассистент, который простым языком объясняет, что сохранено и что можно потерять.',
      en: 'A Git assistant that explains in plain words what is saved and what could be lost.',
    },
    about: {
      ru: 'Для тех, кто пишет код (часто вместе с ИИ), но не хочет становиться экспертом в Git: показывает безопасный следующий шаг и помогает выбраться из сломанного состояния.',
      en: 'For people who write code (often with AI) but don’t want to become Git experts: shows the safe next step and helps recover from a broken state.',
    },
    engineering: [
      { ru: 'Tauri + Rust: настоящие git-операции над локальными репозиториями.', en: 'Tauri + Rust: real git operations on local repositories.' },
      { ru: 'Модель состояния репозитория: что закоммичено, что только локально, что под угрозой.', en: 'A repository state model: what is committed, what is local-only, what is at risk.' },
      { ru: 'Автоматический checkpoint перед pull, merge и переключением ветки.', en: 'Automatic checkpoint before pull, merge and branch switch.' },
      { ru: 'Сценарии восстановления: незавершённый merge или rebase, коммит не в ту ветку.', en: 'Recovery flows: unfinished merge or rebase, a commit on the wrong branch.' },
    ],
    stack: ['Rust', 'Tauri', 'TypeScript', 'React', 'Git'],
    loc: 7_000,
    langs: [['TypeScript', 86.2], ['Rust', 6.9], ['CSS', 4.9], ['Other', 2.0]],
    shots: [
      { ru: 'Стартовый экран', en: 'Welcome screen' },
      { ru: 'Изменения, diff и безопасный коммит', en: 'Changes, diff and safe commit' },
      { ru: 'История', en: 'Timeline' },
      { ru: 'Recovery Center', en: 'Recovery Center' },
      { ru: '«Я запутался»', en: '“I’m lost”' },
      { ru: 'Клонирование', en: 'Clone' },
      { ru: 'Настройки', en: 'Settings' },
    ],
    links: [
      { label: { ru: 'Сайт', en: 'Website' }, href: 'https://branchly-eosin.vercel.app/' },
      { label: { ru: 'Код', en: 'Source' }, href: gh('branchly') },
    ],
  },
];

export const totalLoc = projects.reduce((s, p) => s + p.loc, 0);
