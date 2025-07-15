import { Ref, ref, computed, watch , toRef } from 'vue';
import { useMap as useLeafletMap } from './leaflet/useMap';
import { useMaplibreMap } from './maplibre/useMaplibreMap';
import { MappingBackends, InitMapOptions, LatLngPair, MapType } from '@/types';
import L from 'leaflet';
import M from 'maplibre-gl';

import { LeafletComposable } from './leaflet/useMap';
import { MapLibreComposable } from './maplibre/useMaplibreMap';


// Utility type for a "switch" behavior
export type Switch<T extends string, Cases extends Record<T, unknown>> = Cases[T];


// Example usage for your specific case
export type MapComposable<T extends MappingBackends> = Switch<T, {
  leaflet: LeafletComposable & {backend: MappingBackends};
  maplibre: MapLibreComposable  & {backend: MappingBackends};
}>;



export function useMap<T extends MappingBackends>(
  id: string = 'map', 
  options: InitMapOptions, 
  showRoads: Ref<boolean> | boolean,
  backend: T,
  onReady?: (map: MapType<T> ) => void
): MapComposable<T>  {
  

  const mapInstance = ref<MapType<T> | null>(null);


  // Dynamically initialize the appropriate map composable
  const mapComposable = computed(() => {
    if (backend === 'leaflet') {
      return useLeafletMap(
        id,
        options,
        toRef(showRoads),
        onReady as (map: L.Map) => void // Explicitly cast onReady
      );
    } else {
      return useMaplibreMap(
        id,
        options,
        toRef(showRoads),
        onReady as (map: M.Map) => void // Explicitly cast onReady
      );
    }
  });

  // Proxy methods to the active composable
  const createMap = () => {
    mapInstance.value = mapComposable.value.createMap().value;
  };
  
  const getCenter = () => {
    return mapComposable.value.getCenter();
  };

  const setView = (latlng: LatLngPair, zoom: number) => {
    mapComposable.value.setView(latlng, zoom);
  };
  
  const cleanupMap = () => {
    mapComposable.value.cleanupMap();
  };

  const resetView = () => {
    mapComposable.value.resetView();
  };

  // Watch for backend changes and reinitialize the map
  watch(() => backend, (_newBackend) => {
    if (mapInstance.value) {
      cleanupMap(); // Cleanup the current map
    }
    createMap(); // Recreate the map with the new backend
  });

  return {
    backend, // Expose the reactive backend for switching
    createMap,
    setView,
    resetView,
    cleanupMap,
    getCenter,
    map: mapInstance as Ref<MapType<T> | null>,
  } as MapComposable<T>;
}




