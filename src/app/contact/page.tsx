'use client';

import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { api, getApiErrorMessage } from '@/lib/api';
import { notify } from '@/lib/notify';
import { INQUIRY_SUBJECTS, InquirySubject } from '@/constants/inquiry';
import InquiryRecaptcha from '@/components/contact/InquiryRecaptcha';
import { useCmsSection, mergeCmsData } from '@/hooks/useCmsSection';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: 'General Inquiry' as InquirySubject,
  message: '',
};

export default function ContactPage() {
  const { data: cmsData } = useCmsSection('contact');
  const contact = mergeCmsData('contact', cmsData);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const mapSrc =
    contact.mapEmbedUrl ||
    (contact.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`
      : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (siteKey && !recaptchaToken) {
      notify.warning('Please complete the reCAPTCHA verification');
      return;
    }

    setLoading(true);
    try {
      await api.post('/inquiries', {
        ...form,
        recaptchaToken: recaptchaToken || undefined,
      });
      setSubmitted(true);
      setForm(initialForm);
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
      notify.success('Inquiry submitted! We will get back to you soon.');
    } catch (err: unknown) {
      notify.error(getApiErrorMessage(err, 'Submission failed'));
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{contact.title}</h1>
        <p className="mt-2 text-gray-500">{contact.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold">Contact Information</h2>
            {contact.phone && (
              <p className="text-sm">
                <span className="font-medium text-gray-700">Phone:</span>{' '}
                <a href={`tel:${contact.phone}`} className="text-primary-600 hover:underline">
                  {contact.phone}
                </a>
              </p>
            )}
            {contact.email && (
              <p className="text-sm">
                <span className="font-medium text-gray-700">Email:</span>{' '}
                <a href={`mailto:${contact.email}`} className="text-primary-600 hover:underline">
                  {contact.email}
                </a>
              </p>
            )}
            {contact.address && (
              <p className="text-sm">
                <span className="font-medium text-gray-700">Address:</span> {contact.address}
              </p>
            )}
            {contact.hours && (
              <p className="text-sm">
                <span className="font-medium text-gray-700">Hours:</span> {contact.hours}
              </p>
            )}
          </div>

          {mapSrc && (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <iframe
                title="Office location map"
                src={mapSrc}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {submitted ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Message Sent!</h2>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Thank you for reaching out. We have sent a confirmation to your email and will respond
              shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="btn-secondary mt-6"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <select
                className="input-field"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value as InquirySubject })
                }
                required
              >
                {INQUIRY_SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                className="input-field"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <InquiryRecaptcha ref={recaptchaRef} onChange={setRecaptchaToken} />

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
