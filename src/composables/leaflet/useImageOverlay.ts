import {ref, Ref, watch, isRef, onUnmounted} from 'vue';
import { BoundingBox } from '../../types';
import L from 'leaflet';


export interface LeafletImageOverlayComposable {
  overlay: Ref<L.ImageOverlay>;
  addTo: (map: L.Map) => void;
}

export function useImageOverlay(
  imageUrl: Ref<string> | string, 
  opacity: Ref<number> | number,
  imageBounds: Ref<BoundingBox>,
  _overlayId: string // unused. for api consistency with future maplibre
): LeafletImageOverlayComposable {
  
  imageUrl = isRef(imageUrl) ? imageUrl : ref(imageUrl);
  opacity = isRef(opacity) ? opacity : ref(opacity);
  imageBounds = isRef(imageBounds) ? imageBounds : ref(imageBounds);
  
  function toLeafletBounds(boundingBox: BoundingBox): L.LatLngBounds {
    return new L.LatLngBounds(
      new L.LatLng(boundingBox.south, boundingBox.west),
      new L.LatLng(boundingBox.north, boundingBox.east)
    );
  }
  
  const overlay = ref(new L.ImageOverlay(imageUrl.value, toLeafletBounds(imageBounds.value), {
    opacity: opacity.value,
    interactive: false,
  })) as Ref<L.ImageOverlay>;

  watch(imageUrl, (url: string) => {
    overlay.value.setUrl(url);
  });

  watch(opacity, (value: number) => {
    overlay.value.setOpacity(value);
  });

  watch(imageBounds, (bounds: BoundingBox) => {
    overlay.value.setBounds(toLeafletBounds(bounds));
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