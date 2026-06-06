'use client';

import { useMemo, useState } from 'react';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import { Plot } from '@/lib/types';
import { PLOT_STATUS } from '@/constants/css';
import PlotPopup from '@/components/plots/PlotPopup';

type PlotFilter = 'all' | 'available' | 'booked' | 'sold';

interface PlotMapProps {
  layoutId: string;
  layoutImage?: string;
  plots: Plot[];
  onBookNow?: (plot: Plot) => void;
}

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-gray-200">
      <button
        type="button"
        onClick={() => zoomIn()}
        className="rounded px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => zoomOut()}
        className="rounded px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => resetTransform()}
        className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
        aria-label="Reset zoom"
      >
        Reset
      </button>
    </div>
  );
}

export default function PlotMap({ layoutId, layoutImage, plots, onBookNow }: PlotMapProps) {
  const [filter, setFilter] = useState<PlotFilter>('all');
  const [popupPlot, setPopupPlot] = useState<Plot | null>(null);

  const filteredPlots = useMemo(() => {
    if (filter === 'all') return plots;
    return plots.filter((p) => p.status === filter);
  }, [plots, filter]);

  const filters: { key: PlotFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'booked', label: 'Booked' },
    { key: 'sold', label: 'Sold' },
  ];

  const handleBookNow = (plot: Plot) => {
    setPopupPlot(null);
    onBookNow?.(plot);
  };

  return (
    <div className="space-y-4" data-layout-id={layoutId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Pinch or scroll to zoom · {filteredPlots.length} plot{filteredPlots.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: false, mode: 'zoomIn' }}
        >
          <ZoomControls />
          <TransformComponent
            wrapperClass="!w-full"
            contentClass="!w-full"
          >
            <div className="relative aspect-[16/10] w-full min-w-[320px] bg-gray-50">
              {layoutImage ? (
                <img
                  src={layoutImage}
                  alt="Layout map"
                  className="h-full w-full object-contain p-2"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full min-h-[240px] items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="mt-2 text-sm">No layout image uploaded</p>
                  </div>
                </div>
              )}

              {filteredPlots.map((plot) => (
                <button
                  key={plot._id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupPlot(plot);
                  }}
                  className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border-2 transition hover:scale-125 sm:h-6 sm:w-6 ${PLOT_STATUS[plot.status].map} ${
                    popupPlot?._id === plot._id ? 'ring-2 ring-primary-500 ring-offset-1' : ''
                  }`}
                  style={{
                    left: `${plot.coordinates.x}%`,
                    top: `${plot.coordinates.y}%`,
                  }}
                  title={`Plot ${plot.plotNumber} — ${plot.status}`}
                  aria-label={`Plot ${plot.plotNumber}, ${plot.status}`}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded ${PLOT_STATUS.available.legend}`} />
          Available
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded ${PLOT_STATUS.booked.legend}`} />
          Booked
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded ${PLOT_STATUS.sold.legend}`} />
          Sold
        </div>
      </div>

      {popupPlot && (
        <PlotPopup
          plot={popupPlot}
          onClose={() => setPopupPlot(null)}
          onBookNow={onBookNow ? handleBookNow : undefined}
        />
      )}
    </div>
  );
}
