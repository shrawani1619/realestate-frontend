import { getMapEmbedUrl } from '@/lib/googleMaps';

interface AddressFallbackProps {
  address: string;
}

export default function AddressFallback({ address }: AddressFallbackProps) {
  const embedUrl = getMapEmbedUrl(undefined, undefined, address);

  return (
    <div className="space-y-3">
      {embedUrl ? (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <iframe
            title={`Map of ${address}`}
            src={embedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm font-medium text-gray-700">{address}</p>
        <p className="mt-2 text-sm text-gray-500">
          Map coordinates are not set for this layout. Contact us for directions.
        </p>
      </div>
    </div>
  );
}
