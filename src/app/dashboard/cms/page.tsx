'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';
import {
  AboutCms,
  CMS_DEFAULTS,
  CMS_TABS,
  ContactCms,
  CmsSection,
  FeatureCard,
  FeaturesCms,
  FooterCms,
  HeroCms,
} from '@/lib/cms';
import { mergeCmsData } from '@/hooks/useCmsSection';
import ImageUploadField from '@/components/cms/ImageUploadField';
import CmsSectionPreview, { FeatureCardEditor } from '@/components/cms/CmsSectionPreview';
import CmsSectionReadView from '@/components/cms/CmsSectionReadView';

type SectionData = HeroCms | AboutCms | FeaturesCms | FooterCms | ContactCms;

export default function AdminCMSPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<CmsSection>('hero');
  const [form, setForm] = useState<SectionData>(CMS_DEFAULTS.hero);
  const [savedForm, setSavedForm] = useState<SectionData>(CMS_DEFAULTS.hero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setEditing(false);
    api
      .get<SectionData>(`/cms/${activeTab}`, token)
      .then((data) => {
        const merged = mergeCmsData(activeTab, data);
        setForm(merged);
        setSavedForm(merged);
      })
      .catch(() => {
        const defaults = CMS_DEFAULTS[activeTab];
        setForm(defaults);
        setSavedForm(defaults);
      })
      .finally(() => setLoading(false));
  }, [token, activeTab]);

  const save = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const payload = { ...form };
      delete (payload as { section?: string }).section;
      const updated = await api.put<SectionData>(`/cms/${activeTab}`, payload, token);
      const merged = mergeCmsData(activeTab, updated);
      setForm(merged);
      setSavedForm(merged);
      setEditing(false);
      notify.success(`${CMS_TABS.find((t) => t.id === activeTab)?.label} section saved`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(savedForm);
    setEditing(false);
  };

  const getFeatureCards = () => (form as FeaturesCms).cards ?? CMS_DEFAULTS.features.cards;

  const updateFeatureCard = (index: number, card: FeatureCard) => {
    const features = form as FeaturesCms;
    const cards = [...getFeatureCards()];
    cards[index] = card;
    setForm({ ...features, cards });
  };

  const addFeatureCard = () => {
    const features = form as FeaturesCms;
    const cards = getFeatureCards();
    if (cards.length >= 6) {
      notify.warning('Maximum 6 feature cards allowed');
      return;
    }
    setForm({
      ...features,
      cards: [...cards, { icon: '✨', title: '', description: '' }],
    });
  };

  const removeFeatureCard = (index: number) => {
    const features = form as FeaturesCms;
    setForm({ ...features, cards: getFeatureCards().filter((_, i) => i !== index) });
  };

  const renderEditFields = () => {
    if (activeTab === 'hero') {
      const hero = form as HeroCms;
      return (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Badge Text</label>
            <input
              className="input-field"
              value={hero.badge}
              onChange={(e) => setForm({ ...hero, badge: e.target.value })}
              placeholder="A trusted premium land & plot platform"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              className="input-field"
              value={hero.title}
              onChange={(e) => setForm({ ...hero, title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Subtitle</label>
            <textarea
              className="input-field"
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setForm({ ...hero, subtitle: e.target.value })}
            />
          </div>
          <ImageUploadField
            label="Background Image"
            value={hero.backgroundImage}
            onChange={(url) => setForm({ ...hero, backgroundImage: url })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">CTA Button Text</label>
              <input
                className="input-field"
                value={hero.ctaText}
                onChange={(e) => setForm({ ...hero, ctaText: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">CTA Link</label>
              <input
                className="input-field"
                value={hero.ctaLink}
                onChange={(e) => setForm({ ...hero, ctaLink: e.target.value })}
              />
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'about') {
      const about = form as AboutCms;
      return (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              className="input-field"
              value={about.title}
              onChange={(e) => setForm({ ...about, title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="input-field"
              rows={5}
              value={about.description}
              onChange={(e) => setForm({ ...about, description: e.target.value })}
            />
          </div>
          <ImageUploadField
            label="About Image"
            value={about.image}
            onChange={(url) => setForm({ ...about, image: url })}
          />
        </>
      );
    }

    if (activeTab === 'features') {
      const cards = getFeatureCards();
      return (
        <div className="space-y-4">
          {cards.map((card, index) => (
            <FeatureCardEditor
              key={index}
              card={card}
              index={index}
              onChange={updateFeatureCard}
              onRemove={removeFeatureCard}
            />
          ))}
          {cards.length < 6 && (
            <button type="button" onClick={addFeatureCard} className="btn-secondary text-sm">
              Add Feature Card
            </button>
          )}
        </div>
      );
    }

    if (activeTab === 'footer') {
      const footer = form as FooterCms;
      return (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Company Name</label>
            <input
              className="input-field"
              value={footer.companyName}
              onChange={(e) => setForm({ ...footer, companyName: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                className="input-field"
                value={footer.phone}
                onChange={(e) => setForm({ ...footer, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                className="input-field"
                value={footer.email}
                onChange={(e) => setForm({ ...footer, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              className="input-field"
              value={footer.address}
              onChange={(e) => setForm({ ...footer, address: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Copyright</label>
            <input
              className="input-field"
              value={footer.copyright}
              onChange={(e) => setForm({ ...footer, copyright: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((network) => (
              <div key={network}>
                <label className="mb-1 block text-sm font-medium capitalize">{network}</label>
                <input
                  className="input-field"
                  placeholder={`https://${network}.com/...`}
                  value={footer.socialLinks?.[network] || ''}
                  onChange={(e) =>
                    setForm({
                      ...footer,
                      socialLinks: { ...footer.socialLinks, [network]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </>
      );
    }

    const contact = form as ContactCms;
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Page Title</label>
            <input
              className="input-field"
              value={contact.title}
              onChange={(e) => setForm({ ...contact, title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Subtitle</label>
            <input
              className="input-field"
              value={contact.subtitle}
              onChange={(e) => setForm({ ...contact, subtitle: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Google Maps Embed URL</label>
          <input
            className="input-field"
            value={contact.mapEmbedUrl}
            onChange={(e) => setForm({ ...contact, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              className="input-field"
              value={contact.address}
              onChange={(e) => setForm({ ...contact, address: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hours</label>
            <input
              className="input-field"
              value={contact.hours}
              onChange={(e) => setForm({ ...contact, hours: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              className="input-field"
              value={contact.phone}
              onChange={(e) => setForm({ ...contact, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="input-field"
              value={contact.email}
              onChange={(e) => setForm({ ...contact, email: e.target.value })}
            />
          </div>
        </div>
      </>
    );
  };

  const activeLabel = CMS_TABS.find((t) => t.id === activeTab)?.label;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CMS</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage homepage, about, features, footer, and contact content
          </p>
        </div>
        <Link href="/" target="_blank" className="btn-secondary text-sm">
          Preview Website ↗
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {CMS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setForm(CMS_DEFAULTS[tab.id]);
              setSavedForm(CMS_DEFAULTS[tab.id]);
              setEditing(false);
              setLoading(true);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading section...</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold capitalize">{activeTab} Content</h3>
              {!editing && (
                <button type="button" onClick={() => setEditing(true)} className="btn-secondary text-sm">
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <>
                {renderEditFields()}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="button" onClick={save} disabled={saving} className="btn-primary">
                    {saving ? 'Saving...' : `Save ${activeLabel}`}
                  </button>
                  <button type="button" onClick={handleCancel} disabled={saving} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <CmsSectionReadView section={activeTab} data={savedForm} />
            )}
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold">Live Preview</h3>
            <CmsSectionPreview section={activeTab} data={editing ? form : savedForm} />
          </div>
        </div>
      )}
    </div>
  );
}
