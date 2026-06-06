import Link from 'next/link';

export default function ContactCta() {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-600 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to Find Your Plot?</h2>
        <p className="mt-4 text-primary-100">
          Browse available layouts or reach out to our team — we&apos;re here to help you every step
          of the way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/layouts" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
            Browse Layouts
          </Link>
          <Link
            href="/contact"
            className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
