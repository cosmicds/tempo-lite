import {ref, Ref, watch, isRef, onUnmounted} from 'vue';
import { LatLngBounds } from '../types';
import L from 'leaflet';

export function useLeafletImageOverlay(
  imageUrl: Ref<string> | string, 
  opacity: Ref<number> | number,
  imageBounds: Ref<LatLngBounds | L.LatLngBounds>
) {
  
  imageUrl = isRef(imageUrl) ? imageUrl : ref(imageUrl);
  opacity = isRef(opacity) ? opacity : ref(opacity);
  imageBounds = isRef(imageBounds) ? imageBounds : ref(imageBounds);
  
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

  onUnmounted(() => {
    if (overlay.value) {
      overlay.value.remove();
    }
  });
  
  return { overlay, addTo};

}