import {ref, Ref, watch} from 'vue';
import { LatLngBounds } from '../types';
import L from 'leaflet';

export function useImageOverlay(
  imageUrl: Ref<string> | string, 
  opacity: Ref<number> | number,
  imageBounds: Ref<LatLngBounds | L.LatLngBounds>
) {
  
  imageUrl = ref(imageUrl);
  opacity = ref(opacity);
  imageBounds = ref(imageBounds);
  
  const overlay = ref(new L.ImageOverlay(imageUrl.value, imageBounds.value, {
    opacity: opacity.value,
    interactive: false,
  }));

  watch(imageUrl, (url: string) => {
    overlay.value.setUrl(url);
  });

  watch(opacity, (value: number) => {
    overlay.value.setOpacity(value);
  });

  watch(imageBounds, (bounds: L.LatLngBounds) => {
    overlay.value.setBounds(bounds);
  });
  
  function addTo(map: L.Map) {
    overlay.value.addTo(map);
  }
  
  
  return { overlay, addTo};

}