'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { getGoogleMapsApiKey } from '@/lib/googleMaps';

export default function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      {children}
    </APIProvider>
  );
}
