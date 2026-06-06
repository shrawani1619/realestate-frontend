'use client';

import {
  AboutCms,
  ContactCms,
  CmsSection,
  FeatureCard,
  FeaturesCms,
  FooterCms,
  HeroCms,
} from '@/lib/cms';

interface CmsSectionPreviewProps {
  section: CmsSection;
  data: HeroCms | AboutCms | FeaturesCms | FooterCms | ContactCms;
}

export default function CmsSectionPreview({ section, data }: CmsSectionPreviewProps) {
  if (section === 'hero') {
    const hero = data as HeroCms;
    const hasImage = Boolean(hero.backgroundImage);

    return (
      <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-gray-800 bg-black">
        {hasImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80" />
          </>
        )}
        <div className={`relative px-6 py-10 text-center text-white ${hasImage ? '' : 'bg-gradient-to-b from-black to-emerald-950'}`}>
          {hero.badge && (
            <span className="inline-block rounded-full bg-[#c8ff00] px-3 py-1 text-[10px] font-semibold text-black">
              {hero.badge}
            </span>
          )}
          <h3 className="mt-4 text-xl font-bold">{hero.title}</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-gray-300">{hero.subtitle}</p>
          <span className="mt-5 inline-block rounded-full bg-[#c8ff00] px-4 py-2 text-xs font-semibold text-black">
            {hero.ctaText}
          </span>
        </div>
      </div>
    );
  }

  if (section === 'about') {
    const about = data as AboutCms;
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-xl font-bold">{about.title}</h3>
        <p className="mt-3 text-sm text-gray-600">{about.description}</p>
        {about.image && (
          <img src={about.image} alt="" className="mt-4 max-h-40 w-full rounded-lg object-cover" />
        )}
      </div>
    );
  }

  if (section === 'features') {
    const features = data as FeaturesCms;
    const cards = Array.isArray(features.cards) ? features.cards : [];
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.slice(0, 6).map((card, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <div className="text-2xl">{card.icon || '✨'}</div>
            <p className="mt-2 text-sm font-semibold">{card.title}</p>
            <p className="mt-1 text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section === 'footer') {
    const footer = data as FooterCms;
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm">
        <p className="font-semibold text-primary-700">{footer.companyName}</p>
        <p className="mt-2 text-gray-500">{footer.address}</p>
        <p className="text-gray-500">{footer.phone}</p>
        <p className="text-gray-500">{footer.email}</p>
        <p className="mt-4 text-xs text-gray-400">{footer.copyright}</p>
      </div>
    );
  }

  const contact = data as ContactCms;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm">
      <h3 className="text-lg font-bold">{contact.title}</h3>
      <p className="text-gray-500">{contact.subtitle}</p>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="text-gray-400">Address</dt>
          <dd>{contact.address}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Phone</dt>
          <dd>{contact.phone}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Email</dt>
          <dd>{contact.email}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Hours</dt>
          <dd>{contact.hours}</dd>
        </div>
      </dl>
    </div>
  );
}

export function FeatureCardEditor({
  card,
  index,
  onChange,
  onRemove,
}: {
  card: FeatureCard;
  index: number;
  onChange: (index: number, card: FeatureCard) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Feature {index + 1}</span>
        <button type="button" onClick={() => onRemove(index)} className="text-xs text-red-600">
          Remove
        </button>
      </div>
      <div className="grid gap-3">
        <input
          className="input-field"
          placeholder="Icon (emoji)"
          value={card.icon}
          onChange={(e) => onChange(index, { ...card, icon: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Title"
          value={card.title}
          onChange={(e) => onChange(index, { ...card, title: e.target.value })}
        />
        <textarea
          className="input-field"
          rows={2}
          placeholder="Description"
          value={card.description}
          onChange={(e) => onChange(index, { ...card, description: e.target.value })}
        />
      </div>
    </div>
  );
}
