'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import MapTypeToggle from '@/components/maps/MapTypeToggle';
import {
  getDirectionsUrl,
  getGoogleMapsApiKey,
  getMapEmbedUrl,
  GOOGLE_MAPS_MAP_ID,
} from '@/lib/googleMaps';

interface LayoutLocationMapProps {
  lat: number;
  lng: number;
  layoutName: string;
  address: string;
  layoutId?: string;
}

function LocationMarker({
  lat,
  lng,
  layoutName,
  address,
  layoutId,
}: LayoutLocationMapProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);

  const handleMarkerClick = useCallback(() => {
    setInfoOpen((open) => !open);
  }, []);

  const handleClose = useCallback(() => {
    setInfoOpen(false);
  }, []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat, lng }}
        onClick={handleMarkerClick}
        title={layoutName}
      >
        <Pin background="#16a34a" borderColor="#14532d" glyphColor="#ffffff" />
      </AdvancedMarker>
      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={handleClose}>
          <div className="max-w-[220px] text-sm">
            <p className="font-semibold text-gray-900">{layoutName}</p>
            <p className="mt-1 text-gray-600">{address}</p>
            {layoutId && (
              <Link
                href={`/layouts/${layoutId}`}
                className="mt-2 inline-block font-medium text-primary-600 hover:underline"
              >
                View layout details
              </Link>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function LayoutLocationMap({
  lat,
  lng,
  layoutName,
  address,
  layoutId,
}: LayoutLocationMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const directionsUrl = getDirectionsUrl(lat, lng, address);
  const embedUrl = getMapEmbedUrl(lat, lng, address);

  if (!apiKey) {
    if (embedUrl) {
      return (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <iframe
              title={`Map of ${layoutName}`}
              src={embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="text-xs text-gray-500">
            Basic map embed. Add{' '}
            <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> in{' '}
            <code className="text-xs">.env.local</code> for interactive maps.
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex text-sm"
          >
            Get Directions
          </a>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
        <p className="font-medium">Google Maps unavailable</p>
        <p className="mt-1 text-sm">
          Add <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to enable maps.
        </p>
        <p className="mt-3 text-sm text-gray-700">{address}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-gray-200">
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          mapId={GOOGLE_MAPS_MAP_ID}
          gestureHandling="greedy"
          fullscreenControl
          zoomControl
          mapTypeControl={false}
          streetViewControl={false}
          style={{ width: '100%', height: '400px' }}
          reuseMaps
        >
          <MapTypeToggle />
          <LocationMarker
            lat={lat}
            lng={lng}
            layoutName={layoutName}
            address={address}
            layoutId={layoutId}
          />
        </Map>
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary inline-flex text-sm"
      >
        Get Directions
      </a>
    </div>
  );
}
