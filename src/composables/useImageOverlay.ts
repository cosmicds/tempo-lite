import {Ref} from 'vue';
import { BoundingBox, MappingBackends } from '../types';

import { useLeafletImageOverlay } from './useLeafletImageOverlay';

export function useImageOverlay(
  imageUrl: Ref<string> | string, 
  opacity: Ref<number> | number,
  imageBounds: Ref<BoundingBox>,
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