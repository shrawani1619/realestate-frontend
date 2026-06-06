import type { Metadata } from 'next';
import { getOgImageUrl, SITE_NAME } from '@/lib/site';

const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about our land development expertise and how we help families and investors find the perfect property.',
  openGraph: {
    title: 'About Us | Real Estate Plot Management',
    description:
      'Learn about our land development expertise and how we help families and investors find the perfect property.',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — About Us` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us',
    description: 'Learn about our land development expertise and plot management services.',
    images: [ogImage],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
