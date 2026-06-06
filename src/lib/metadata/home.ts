import type { Metadata } from 'next';
import { getOgImageUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const homeMetadata: Metadata = {
  title: `${SITE_NAME} | Find Your Perfect Plot`,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${SITE_NAME} | Find Your Perfect Plot`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Find Your Perfect Plot`,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  alternates: {
    canonical: siteUrl,
  },
};
