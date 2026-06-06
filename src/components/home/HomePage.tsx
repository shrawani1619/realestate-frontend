'use client';

import { useCmsSection, mergeCmsData } from '@/hooks/useCmsSection';
import Hero from '@/components/home/Hero';
import StatsSection from '@/components/home/StatsSection';
import FeaturedLayouts from '@/components/home/FeaturedLayouts';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturesSection from '@/components/home/FeaturesSection';
import ContactCta from '@/components/home/ContactCta';

export default function HomePage() {
  const { data: heroData } = useCmsSection('hero');
  const { data: featuresData } = useCmsSection('features');
  const hero = mergeCmsData('hero', heroData);
  const features = mergeCmsData('features', featuresData);

  return (
    <>
      <Hero hero={hero} />
      <StatsSection />
      <FeaturedLayouts />
      <HowItWorks />
      <FeaturesSection features={features} />
      <ContactCta />
    </>
  );
}
