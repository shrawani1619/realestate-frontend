import { Layout } from '@/lib/types';

export const MAX_LAYOUT_IMAGES = 10;

export function getLayoutImages(layout: Pick<Layout, 'images' | 'imageUrl'>): string[] {
  if (layout.images?.length) return layout.images;
  if (layout.imageUrl) return [layout.imageUrl];
  return [];
}

export function getPrimaryLayoutImage(layout: Pick<Layout, 'images' | 'imageUrl'>): string {
  return getLayoutImages(layout)[0] || '';
}
