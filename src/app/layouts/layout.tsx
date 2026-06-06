import type { Metadata } from 'next';
import { getOgImageUrl, SITE_NAME } from '@/lib/site';

const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: 'Browse Available Properties',
  description:
    'Explore land layouts, compare starting prices, and find available plots across premium real estate projects.',
  openGraph: {
    title: 'Browse Available Properties | Real Estate Plot Management',
    description:
      'Explore land layouts, compare starting prices, and find available plots across premium real estate projects.',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — Layouts` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Available Properties',
    description:
      'Explore land layouts and find available plots across premium real estate projects.',
    images: [ogImage],
  },
};

export default function LayoutsSectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
