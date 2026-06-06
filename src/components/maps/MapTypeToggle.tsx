'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useState } from 'react';

type MapTypeId = 'roadmap' | 'satellite';

export default function MapTypeToggle() {
  const map = useMap();
  const [mapType, setMapType] = useState<MapTypeId>('roadmap');

  const handleChange = (type: MapTypeId) => {
    map?.setMapTypeId(type);
    setMapType(type);
  };

  return (
    <div className="absolute left-3 top-3 z-10 flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <button
        type="button"
        onClick={() => handleChange('roadmap')}
        className={`px-3 py-1.5 text-xs font-medium transition ${
          mapType === 'roadmap'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Roadmap
      </button>
      <button
        type="button"
        onClick={() => handleChange('satellite')}
        className={`px-3 py-1.5 text-xs font-medium transition ${
          mapType === 'satellite'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Satellite
      </button>
    </div>
  );
}
