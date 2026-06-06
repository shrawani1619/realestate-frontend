import type { Metadata } from 'next';
import { getOgImageUrl, SITE_NAME } from '@/lib/site';

const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with our real estate team for plot inquiries, site visits, and booking assistance.',
  openGraph: {
    title: 'Contact Us | Real Estate Plot Management',
    description:
      'Get in touch with our real estate team for plot inquiries, site visits, and booking assistance.',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — Contact` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us',
    description: 'Reach out for plot inquiries and booking assistance.',
    images: [ogImage],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
