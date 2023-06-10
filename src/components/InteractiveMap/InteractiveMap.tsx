'use client';

import { useIsomorphicLayoutEffect } from '@/hooks';
import { ComponentPropsWithoutRef, useCallback, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import zonesJson from '@/assets/map/zones.json';
import regionsJson from '@/assets/map/regions.json';

import type { Feature } from 'geojson';

export interface InteractiveMapProps extends ComponentPropsWithoutRef<'div'> {}

export default function InteractiveMap({ ...rest }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null!);

  const initializeMap = useCallback(
    () =>
      new maplibregl.Map({
        container: containerRef.current,
        dragRotate: false,
        style: {
          version: 8,
          glyphs: '/fonts/pbf/{fontstack}/{range}.pbf',
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['/images/map/{z}_{x}_{y}.jpg'],
              tileSize: 256,
              maxzoom: 22,
              minzoom: 0,
            },
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
            },
          ],
        },
        center: [0, 0],
        renderWorldCopies: false,
      }),
    []
  );

  const initializeZones = useCallback((map: maplibregl.Map) => {
    const polygons: Feature[] = zonesJson.map((zone, index) => ({
      id: index,
      type: 'Feature',
      properties: { name: zone.name_ko },
      geometry: { type: 'Polygon', coordinates: [zone.geometry] },
    }));

    const points: Feature[] = zonesJson.map((zone, index) => ({
      id: index,
      type: 'Feature',
      properties: { name: zone.name_ko },
      geometry: { type: 'Point', coordinates: [zone.longitude, zone.latitude] },
    }));

    map.addSource('zones', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: polygons },
    });

    map.addSource('zone-labels', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: points },
    });

    map.addLayer({
      id: 'zones-fills',
      type: 'fill',
      source: 'zones',
      layout: {},
      paint: {
        'fill-color': 'red',
        'fill-opacity': 0.3,
      },
    });

    map.addLayer({
      id: 'zones-lines',
      type: 'line',
      source: 'zones',
      layout: {},
      paint: {
        'line-color': 'red',
        'line-opacity': 1.0,
        'line-width': 4,
      },
    });

    map.addLayer({
      id: 'zone-labels',
      type: 'symbol',
      source: 'zone-labels',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['roboto'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto',
        'icon-image': ['concat', ['get', 'icon'], '_15'],
        'text-size': 20,
      },
      paint: {
        'text-color': '#000000',
        'text-opacity': 1,
        'text-halo-width': 2,
        'text-halo-color': '#AC9F81',
        'text-halo-blur': 0,
      },
      minzoom: 0,
      maxzoom: 22,
    });
  }, []);

  const initializeRegions = useCallback((map: maplibregl.Map) => {
    const polygons: Feature[] = regionsJson.map((zone, index) => ({
      id: index,
      type: 'Feature',
      properties: { name: zone.name_ko },
      geometry: { type: 'Polygon', coordinates: [zone.geometry] },
    }));

    const points: Feature[] = regionsJson.map((zone, index) => ({
      id: index,
      type: 'Feature',
      properties: { name: zone.name_ko },
      geometry: { type: 'Point', coordinates: [zone.longitude, zone.latitude] },
    }));

    map.addSource('regions', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: polygons },
    });

    map.addSource('region-labels', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: points },
    });

    map.addLayer({
      id: 'region-fills',
      type: 'fill',
      source: 'regions',
      layout: {},
      paint: {
        'fill-color': 'blue',
        'fill-opacity': 0.3,
      },
    });

    map.addLayer({
      id: 'region-lines',
      type: 'line',
      source: 'regions',
      layout: {},
      paint: {
        'line-color': 'blue',
        'line-opacity': 1.0,
        'line-width': 4,
      },
    });

    map.addLayer({
      id: 'region-labels',
      type: 'symbol',
      source: 'region-labels',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['roboto'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto',
        'icon-image': ['concat', ['get', 'icon'], '_15'],
        'text-size': 18,
      },
      paint: {
        'text-color': '#FFFFFF',
        'text-opacity': 0.6,
        'text-halo-width': 0.5,
        'text-halo-color': '#000000',
        'text-halo-blur': 0.5,
      },
      minzoom: 2,
      maxzoom: 22,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const map = initializeMap();

    map.on('load', () => {
      initializeZones(map);
      initializeRegions(map);
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} {...rest} />;
}
