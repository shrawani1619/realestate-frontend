import useSWR from 'swr';
import { api } from '@/lib/api';
import { CMS_DEFAULTS, CmsSection } from '@/lib/cms';

export function useCmsSection<S extends CmsSection>(section: S) {
  type SectionData = (typeof CMS_DEFAULTS)[S];

  return useSWR<SectionData>(
    ['cms', section],
    () => api.get<SectionData>(`/cms/${section}`),
    {
      revalidateOnFocus: false,
      fallbackData: CMS_DEFAULTS[section] as SectionData,
    }
  );
}

export function mergeCmsData<S extends CmsSection>(
  section: S,
  data?: Partial<(typeof CMS_DEFAULTS)[S]>
): (typeof CMS_DEFAULTS)[S] {
  const merged = { ...CMS_DEFAULTS[section], ...data } as (typeof CMS_DEFAULTS)[S];

  if (section === 'features' && !Array.isArray((merged as { cards?: unknown }).cards)) {
    return CMS_DEFAULTS.features as (typeof CMS_DEFAULTS)[S];
  }

  if (section === 'footer' && typeof (merged as { socialLinks?: unknown }).socialLinks !== 'object') {
    return {
      ...merged,
      socialLinks: CMS_DEFAULTS.footer.socialLinks,
    } as (typeof CMS_DEFAULTS)[S];
  }

  return merged;
}
