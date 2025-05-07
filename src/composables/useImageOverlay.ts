import {Ref} from 'vue';
import { LatLngBounds, MappingBackends } from '../types';
import L from 'leaflet';

import { useLeafletImageOverlay } from './useLeafletImageOverlay';

export function useImageOverlay(
  imageUrl: Ref<string> | string, 
  opacity: Ref<number> | number,
  imageBounds: Ref<LatLngBounds | L.LatLngBounds>,
  backend: MappingBackends = 'leaflet'
) {
  
  backend;
  
  return useLeafletImageOverlay(imageUrl, opacity, imageBounds);
  
  // if (backend === 'leaflet') {
  //   return useLeafletImageOverlay(imageUrl, opacity, imageBounds);
  // }
  
  // if (backend === 'maplibre') {
  //   return null;
  // }
}