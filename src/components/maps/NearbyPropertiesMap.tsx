'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  getGoogleMapsApiKey,
  GOOGLE_MAPS_MAP_ID,
  hasValidCoordinates,
} from '@/lib/googleMaps';
import { Layout } from '@/lib/types';

export interface LayoutMapPin {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

function layoutToPin(layout: Layout): LayoutMapPin | null {
  const lat = layout.coordinates?.lat;
  const lng = layout.coordinates?.lng;
  if (!hasValidCoordinates(lat, lng)) return null;

  return {
    id: layout._id,
    name: layout.name,
    address: layout.location,
    lat: lat as number,
    lng: lng as number,
  };
}

function LayoutPinMarker({ pin }: { pin: LayoutMapPin }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: pin.lat, lng: pin.lng }}
        onClick={() => setInfoOpen(true)}
        title={pin.name}
      >
        <Pin background="#15803d" borderColor="#14532d" glyphColor="#ffffff" />
      </AdvancedMarker>
      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)}>
          <div className="max-w-[200px] text-sm">
            <p className="font-semibold text-gray-900">{pin.name}</p>
            <p className="mt-1 text-gray-600">{pin.address}</p>
            <Link
              href={`/layouts/${pin.id}`}
              className="mt-2 inline-block font-medium text-primary-600 hover:underline"
            >
              View layout
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MarkerClusterLayer({ pins }: { pins: LayoutMapPin[] }) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!map || pins.length === 0) return;

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    clustererRef.current?.clearMarkers();
    clustererRef.current = null;

    const markers = pins.map((pin) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: pin.lat, lng: pin.lng },
        title: pin.name,
      });
      marker.addListener('click', () => {
        window.open(`/layouts/${pin.id}`, '_self');
      });
      return marker;
    });

    markersRef.current = markers;
    clustererRef.current = new MarkerClusterer({ map, markers });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [map, pins]);

  return null;
}

interface NearbyPropertiesMapProps {
  layouts: Layout[];
}

export default function NearbyPropertiesMap({ layouts }: NearbyPropertiesMapProps) {
  const apiKey = getGoogleMapsApiKey();

  const pins = useMemo(
    () =>
      layouts
        .filter((layout) => layout.status === 'active')
        .map(layoutToPin)
        .filter((pin): pin is LayoutMapPin => pin !== null),
    [layouts]
  );

  const defaultCenter = useMemo(() => {
    if (pins.length === 0) return { lat: 20.5937, lng: 78.9629 };
    const lat = pins.reduce((sum, pin) => sum + pin.lat, 0) / pins.length;
    const lng = pins.reduce((sum, pin) => sum + pin.lng, 0) / pins.length;
    return { lat, lng };
  }, [pins]);

  if (!apiKey) {
    return null;
  }

  if (pins.length === 0) {
    return null;
  }

  const useClustering = pins.length >= 5;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900">Nearby Properties</h2>
      <p className="mt-1 text-sm text-gray-500">
        Explore all layout locations on the map{pins.length >= 5 ? ' — clustered for easier browsing' : ''}.
      </p>
      <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-200">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={pins.length === 1 ? 14 : 6}
          mapId={GOOGLE_MAPS_MAP_ID}
          gestureHandling="cooperative"
          fullscreenControl
          zoomControl
          mapTypeControl
          streetViewControl={false}
          style={{ width: '100%', height: '320px' }}
          reuseMaps
        >
          {useClustering ? (
            <MarkerClusterLayer pins={pins} />
          ) : (
            pins.map((pin) => <LayoutPinMarker key={pin.id} pin={pin} />)
          )}
        </Map>
      </div>
    </section>
  );
}
