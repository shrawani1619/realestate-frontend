'use client';

import {
  AboutCms,
  ContactCms,
  CmsSection,
  FeaturesCms,
  FooterCms,
  HeroCms,
} from '@/lib/cms';

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 break-words">{value?.trim() ? value : '—'}</dd>
    </div>
  );
}

function ReadOnlyImage({ label, src }: { label: string; src?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      {src ? (
        <img src={src} alt="" className="mt-2 max-h-32 w-full rounded-lg object-cover" />
      ) : (
        <dd className="mt-1 text-sm text-gray-400">No image set</dd>
      )}
    </div>
  );
}

interface CmsSectionReadViewProps {
  section: CmsSection;
  data: HeroCms | AboutCms | FeaturesCms | FooterCms | ContactCms;
}

export default function CmsSectionReadView({ section, data }: CmsSectionReadViewProps) {
  if (section === 'hero') {
    const hero = data as HeroCms;
    return (
      <dl className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField label="Badge Text" value={hero.badge} />
        <ReadOnlyField label="Title" value={hero.title} />
        <div className="sm:col-span-2">
          <ReadOnlyField label="Subtitle" value={hero.subtitle} />
        </div>
        <div className="sm:col-span-2">
          <ReadOnlyImage label="Background Image" src={hero.backgroundImage} />
        </div>
        <ReadOnlyField label="CTA Button Text" value={hero.ctaText} />
        <ReadOnlyField label="CTA Link" value={hero.ctaLink} />
      </dl>
    );
  }

  if (section === 'about') {
    const about = data as AboutCms;
    return (
      <dl className="grid gap-4">
        <ReadOnlyField label="Title" value={about.title} />
        <ReadOnlyField label="Description" value={about.description} />
        <ReadOnlyImage label="About Image" src={about.image} />
      </dl>
    );
  }

  if (section === 'features') {
    const features = data as FeaturesCms;
    const cards = Array.isArray(features.cards) ? features.cards : [];
    return (
      <div className="space-y-3">
        {cards.length === 0 ? (
          <p className="text-sm text-gray-400">No feature cards added</p>
        ) : (
          cards.map((card, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Feature {index + 1}</p>
              <div className="mt-2 flex items-start gap-3">
                <span className="text-2xl">{card.icon || '✨'}</span>
                <div>
                  <p className="font-medium text-gray-900">{card.title || '—'}</p>
                  <p className="mt-1 text-sm text-gray-600">{card.description || '—'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (section === 'footer') {
    const footer = data as FooterCms;
    return (
      <dl className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField label="Company Name" value={footer.companyName} />
        <ReadOnlyField label="Address" value={footer.address} />
        <ReadOnlyField label="Phone" value={footer.phone} />
        <ReadOnlyField label="Email" value={footer.email} />
        <div className="sm:col-span-2">
          <ReadOnlyField label="Copyright" value={footer.copyright} />
        </div>
        {(['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((network) => (
          <ReadOnlyField
            key={network}
            label={network}
            value={footer.socialLinks?.[network]}
          />
        ))}
      </dl>
    );
  }

  const contact = data as ContactCms;
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <ReadOnlyField label="Page Title" value={contact.title} />
      <ReadOnlyField label="Subtitle" value={contact.subtitle} />
      <div className="sm:col-span-2">
        <ReadOnlyField label="Google Maps Embed URL" value={contact.mapEmbedUrl} />
      </div>
      <ReadOnlyField label="Address" value={contact.address} />
      <ReadOnlyField label="Hours" value={contact.hours} />
      <ReadOnlyField label="Phone" value={contact.phone} />
      <ReadOnlyField label="Email" value={contact.email} />
    </dl>
  );
}
