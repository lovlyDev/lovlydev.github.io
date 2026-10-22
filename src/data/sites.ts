import type { L } from '../i18n';

/** Concept websites for fictional businesses, each published from its own repo. */
export type Site = {
  id: string;
  name: string;
  kind: L;
  about: L;
  fonts: string;
  palette: string[];
};

export const siteUrl = (id: string) => `https://lovlydev.github.io/concept-${id}/`;
export const siteRepo = (id: string) => `https://github.com/lovlyDev/concept-${id}`;

export const sites: Site[] = [
  {
    id: 'coffee',
    name: 'Зерно',
    kind: { ru: 'Кофейня', en: 'Coffee shop' },
    about: { ru: 'Тёплый светлый стиль, арка с фото, бегущая строка и меню на вкладках.', en: 'Warm light style, arched photo, marquee and a tabbed menu.' },
    fonts: 'Fraunces / Inter',
    palette: ['#f4ede4', '#2b1d14', '#c8693b'],
  },
  {
    id: 'restaurant',
    name: 'Угли',
    kind: { ru: 'Ресторан', en: 'Restaurant' },
    about: { ru: 'Тёмный «дорогой» сайт: параллакс, авторские блюда, сет и форма брони.', en: 'Dark upscale site: parallax, signature dishes, tasting set and a booking form.' },
    fonts: 'Cormorant / Manrope',
    palette: ['#0e0d0b', '#c9a35c', '#ece6da'],
  },
  {
    id: 'barbershop',
    name: 'Острие',
    kind: { ru: 'Барбершоп', en: 'Barbershop' },
    about: { ru: 'Брутальная типографика, прайс с длительностью, мастера, мозаика и FAQ.', en: 'Bold typography, price list with durations, barbers, mosaic and FAQ.' },
    fonts: 'Oswald / Inter',
    palette: ['#0b0b0b', '#ff4d2e', '#f2f0eb'],
  },
  {
    id: 'dental',
    name: 'Белая линия',
    kind: { ru: 'Стоматология', en: 'Dental clinic' },
    about: { ru: 'Спокойный «бумажный» сайт: прайс со сметой-чеком, врачи с днями приёма и запись на свободное время.', en: 'A calm, paper-like site: a price list that builds a receipt, doctors’ schedules and booking into free slots.' },
    fonts: 'Spectral / Onest',
    palette: ['#f4f1eb', '#1d2422', '#3d6b5e'],
  },
  {
    id: 'autoservice',
    name: 'Шестерня',
    kind: { ru: 'Автосервис', en: 'Car service' },
    about: { ru: 'Индустриальный стиль: цены по классу авто, «открыто сейчас» и заявка на ремонт.', en: 'Industrial style: prices by car class, live “open now” badge and a repair request form.' },
    fonts: 'Russo One / Golos Text',
    palette: ['#15171a', '#f5c518', '#eef0f2'],
  },
  {
    id: 'beauty',
    name: 'Пион',
    kind: { ru: 'Салон красоты', en: 'Beauty salon' },
    about: { ru: 'Нежный сайт: прайс по вкладкам, галерея и онлайн-запись с выбором дня и времени.', en: 'A soft, airy site: tabbed price list, gallery and booking with day and time slots.' },
    fonts: 'Forum / Montserrat',
    palette: ['#fbf6f4', '#c2667a', '#3a2a2e'],
  },
  {
    id: 'photographer',
    name: 'Вера Лаврова',
    kind: { ru: 'Визитка фотографа', en: 'Photographer' },
    about: { ru: 'Журнальная чёрно-белая вёрстка, фильтр серий и полноэкранный просмотр.', en: 'Editorial black-and-white layout, series filter and a fullscreen viewer.' },
    fonts: 'Playfair Display / Inter',
    palette: ['#f3f1ec', '#111111', '#bdb8ae'],
  },
  {
    id: 'lawyer',
    name: 'Максим Орлов',
    kind: { ru: 'Визитка юриста', en: 'Lawyer' },
    about: { ru: 'Строгий сайт-визитка: практики, принципы, цифры и форма консультации.', en: 'A formal business card: practice areas, principles, numbers and a consultation form.' },
    fonts: 'PT Serif / IBM Plex Sans',
    palette: ['#0f1c2e', '#b08d57', '#f5f1e8'],
  },
];
