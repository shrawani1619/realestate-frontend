'use client';

import Link from 'next/link';
import { useCmsSection, mergeCmsData } from '@/hooks/useCmsSection';

export default function Footer() {
  const { data } = useCmsSection('footer');
  const footer = mergeCmsData('footer', data);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Layouts', href: '/layouts' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialEntries = Object.entries(footer.socialLinks || {}).filter(([, url]) => url);

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-primary-700">{footer.companyName}</p>
            <p className="mt-2 text-sm text-gray-500">{footer.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Contact</p>
            <p className="mt-2 text-sm text-gray-500">{footer.phone}</p>
            <a href={`mailto:${footer.email}`} className="text-sm text-primary-600 hover:underline">
              {footer.email}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Quick Links</p>
            <div className="mt-2 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-primary-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {socialEntries.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900">Follow Us</p>
              <div className="mt-2 flex flex-col gap-2">
                {socialEntries.map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm capitalize text-gray-500 hover:text-primary-600"
                  >
                    {network}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">{footer.copyright}</p>
      </div>
    </footer>
  );
}
