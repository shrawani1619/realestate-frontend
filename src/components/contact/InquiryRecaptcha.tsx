'use client';

import { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface InquiryRecaptchaProps {
  onChange: (token: string | null) => void;
}

const InquiryRecaptcha = forwardRef<ReCAPTCHA, InquiryRecaptchaProps>(function InquiryRecaptcha(
  { onChange },
  ref
) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        reCAPTCHA is not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to enable spam protection.
      </p>
    );
  }

  return <ReCAPTCHA ref={ref} sitekey={siteKey} onChange={onChange} />;
});

export default InquiryRecaptcha;
