const STEPS = [
  {
    step: '01',
    icon: '🗺️',
    title: 'Browse Layouts',
    description: 'Explore land layouts with photos, pricing, and plot availability on interactive maps.',
  },
  {
    step: '02',
    icon: '📍',
    title: 'Select Your Plot',
    description: 'Click plots on the layout map to view size, facing, price, and location details.',
  },
  {
    step: '03',
    icon: '✅',
    title: 'Book & Confirm',
    description: 'Submit a booking request online. Track approval status and download your receipt.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-gray-500">Three simple steps to secure your plot.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative card text-center">
              {index < STEPS.length - 1 && (
                <span
                  className="absolute right-0 top-1/2 hidden h-0.5 w-8 translate-x-full -translate-y-1/2 bg-primary-200 md:block lg:w-12"
                  aria-hidden
                />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Step {item.step}
              </span>
              <div className="mt-4 text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-primary-800">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
