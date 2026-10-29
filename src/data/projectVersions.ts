import { useEffect, useState } from 'react';
import type { Project } from './projects';

type VersionSource = NonNullable<Project['versionSource']>;
const requests = new Map<string, Promise<string | undefined>>();
const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/** One request per source per page load, including React StrictMode remounts. */
export function fetchProjectVersion({ repo, path }: VersionSource): Promise<string | undefined> {
  const endpoint = path
    ? `https://api.github.com/repos/${repo}/contents/${path}`
    : `https://api.github.com/repos/${repo}/releases/latest`;
  let request = requests.get(endpoint);
  if (!request) {
    request = (async () => {
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: path ? 'application/vnd.github.raw+json' : 'application/vnd.github+json' },
          signal: AbortSignal.timeout(6000),
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!path && (data.draft || data.prerelease)) return;
        const raw = path ? data.version : data.tag_name;
        if (typeof raw !== 'string') return;
        const version = raw.replace(/^v/, '');
        return versionPattern.test(version) ? version : undefined;
      } catch {
        // Offline, rate-limited or unavailable: keep the checked-in version.
        return undefined;
      }
    })();
    requests.set(endpoint, request);
  }
  return request;
}

export function useProjectVersion(project: Project): string {
  const [resolved, setResolved] = useState<{ id: string; version: string }>();
  const { id, version, versionSource } = project;
  useEffect(() => {
    if (!versionSource) return;
    let active = true;
    void fetchProjectVersion(versionSource).then(latest => {
      if (active && latest) setResolved({ id, version: latest });
    });
    return () => { active = false; };
  }, [id, versionSource]);
  return resolved?.id === id ? resolved.version : version;
}
