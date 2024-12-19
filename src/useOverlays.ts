import {ref, Ref, watch} from 'vue';
import { LatLngBounds } from './types';
import L from 'leaflet';

export function useOverlays(
  imageUrl: Ref<string>, 
  cloudUrl: Ref<string>, 
  showClouds: Ref<boolean>,
  opacity: Ref<number>,
  imageBounds: Ref<LatLngBounds>
) {
  
  const imageOverlay = ref(new L.ImageOverlay("", imageBounds.value, {
    opacity: opacity.value,
    interactive: false,
  }));

  const cloudOverlay = ref(new L.ImageOverlay("", imageBounds.value, {
    opacity: opacity.value,
    interactive: false,
  }));

  watch(imageUrl, (url: string) => {
    imageOverlay.value.setUrl(url);
  });

  watch([cloudUrl, showClouds], ([url, show]) => {
    cloudOverlay.value.setUrl(show ? url : '');
  });

  watch(opacity, (value: number) => {
    imageOverlay.value.setOpacity(value);
    cloudOverlay.value.setOpacity(value);
  });

  watch(imageBounds, (bounds: L.LatLngBounds) => {
    imageOverlay.value.setBounds(bounds);
    cloudOverlay.value.setBounds(bounds);
  });
  
  function addOverlays(map: L.Map) {
    imageOverlay.value.addTo(map);
    cloudOverlay.value.addTo(map);
  }

  return {
    imageOverlay,
    cloudOverlay,
    addOverlays,
  };
}