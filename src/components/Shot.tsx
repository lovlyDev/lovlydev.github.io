import { shotBase } from '../data/projects';

/** A screenshot served as AVIF with a WebP fallback. */
export function Shot({ id, i, alt = '', lazy = false }: { id: string; i: number; alt?: string; lazy?: boolean }) {
  const base = shotBase(id, i);
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      <img src={`${base}.webp`} alt={alt} loading={lazy ? 'lazy' : undefined} decoding="async" />
    </picture>
  );
}
