import type { L } from '../i18n';

export type Vfx = {
  /** file name in public/vfx: <id>.mp4 (with sound) and <id>.webp poster */
  id: string;
  name: string;
  kind: L;
  duration: string;
  /** width / height of the cropped video */
  aspect: number;
  about: L;
  beats: L[];
  tags: string[];
};

export const vfx: Vfx[] = [
  {
    id: 'orbital-strike',
    name: 'Orbital Strike',
    kind: { ru: 'Катсцена', en: 'Cutscene' },
    duration: '0:19',
    aspect: 1086 / 464,
    about: {
      ru: 'Удар метеорита от первого кадра до последнего: луч с орбиты, метеорит в энергетических кольцах, вход в атмосферу сквозь облака, ударная волна и дымящийся кратер.',
      en: 'A meteor strike from first frame to last: a beam from orbit, a meteor wrapped in energy rings, atmospheric entry through clouds, a shockwave and a smoking crater.',
    },
    beats: [
      { ru: 'Постановка камеры как в кино: широкий кадр, смена планов', en: 'Film-style camera work: widescreen framing, shot changes' },
      { ru: 'Свечение, кольца, огонь, облака и дым', en: 'Glow, rings, fire, clouds and smoke' },
      { ru: 'Купол ударной волны и вспышка в момент удара', en: 'A shockwave dome and a flash on impact' },
    ],
    tags: ['Roblox Studio', 'Luau', 'Particles', 'Beams', 'Camera'],
  },
  {
    id: 'arcane-burst',
    name: 'Arcane Burst',
    kind: { ru: 'Способность персонажа', en: 'Character ability' },
    duration: '0:09',
    aspect: 1086 / 558,
    about: {
      ru: 'Способность в аниме-стиле: магические круги и заряд, выстрел лучом, удар с линиями скорости, вспышка на весь экран и столб энергии.',
      en: 'An anime-style ability: magic circles and charge-up, a beam shot, an impact with speed lines, a full-screen flash and an energy pillar.',
    },
    beats: [
      { ru: 'Несколько фаз: заряд, выстрел, удар, финал', en: 'Several phases: charge, shot, impact, finale' },
      { ru: 'Линии скорости и вспышка для ощущения силы удара', en: 'Speed lines and a flash to sell the hit' },
      { ru: 'Яркая палитра: розовый, жёлтый, бирюзовый', en: 'Bold palette: pink, yellow, cyan' },
    ],
    tags: ['Roblox Studio', 'Luau', 'Particles', 'Beams', 'Anime VFX'],
  },
];
