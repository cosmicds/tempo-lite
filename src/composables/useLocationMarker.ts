import { Ref, computed } from 'vue';
import { MappingBackends, MapType, Prettify, LatLngPair } from '../types';
import { useLocationMarker as useLeafletLocationMarker } from './leaflet/useMarker';
import { useLocationMarker as useMaplibreLocationMarker } from './maplibre/useMaplibreMarkers';
import L from 'leaflet';

// Define the unified interface for location markers
export interface LocationMarkerComposable {
  locationMarker: Ref<L.Marker | maplibregl.Marker | null>;
  setMarker: (latlng: LatLngPair | L.LatLngExpression) => void;
  removeMarker: () => void;
  showLocationMarker: Ref<boolean>;
}

export type LocationMarkerType<T extends MappingBackends> = 
  T extends 'leaflet' ? ReturnType<typeof useLeafletLocationMarker> :
  T extends 'maplibre' ? ReturnType<typeof useMaplibreLocationMarker> :
  never;

export function useLocationMarker<T extends MappingBackends>(
  map: Ref<MapType<T> | null>, 
  show: boolean, 
  backend: T
): Prettify<LocationMarkerType<T>> {
  
  const markerComposable = computed(() => {
    if (backend === 'leaflet') {
      return useLeafletLocationMarker(map as Ref<L.Map | null>, show) as LocationMarkerType<T>;
    } else {
      return useMaplibreLocationMarker(map as Ref<maplibregl.Map | null>, show) as LocationMarkerType<T>;
    }
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locationMarker = computed(() => {
    return markerComposable.value.locationMarker.value;
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showLocationMarker = computed(() => {
    return markerComposable.value.showLocationMarker.value;
  });
  
  function setMarker(latlng: LatLngPair | L.LatLngExpression) {
    if (backend === 'leaflet') {
      (markerComposable.value as ReturnType<typeof useLeafletLocationMarker>).setMarker(latlng as L.LatLngExpression);
    } else {
      (markerComposable.value as ReturnType<typeof useMaplibreLocationMarker>).setMarker(latlng as LatLngPair);
    }
  }
  
  function removeMarker() {
    markerComposable.value.removeMarker();
  }
  
  return {
    locationMarker: markerComposable.value.locationMarker,
    setMarker,
    removeMarker,
    showLocationMarker: markerComposable.value.showLocationMarker
  } as unknown as Prettify<LocationMarkerType<T>>;
}