import { ref, Ref, watch, computed } from 'vue';
import maplibregl, {LayerSpecification} from 'maplibre-gl';
import { LatLngBounds } from './types';
type MaplibreLayer = LayerSpecification; //Exclude<ReturnType<typeof maplibregl.Map.prototype.getLayer>, undefined>;



interface UseOverlaysType {
  imageOverlay: Ref<MaplibreLayer | null>;
  cloudOverlay: Ref<MaplibreLayer | null>;
  addOverlays: (map: maplibregl.Map) => void;
}

export function useOverlays(
  imageUrl: Ref<string>,
  cloudUrl: Ref<string>,
  showClouds: Ref<boolean>,
  opacity: Ref<number>,
  imageBounds: Ref<LatLngBounds>
): UseOverlaysType {
  const imageOverlayId = 'image-overlay';
  const cloudOverlayId = 'cloud-overlay';

  const imageOverlay = ref<MaplibreLayer | null>(null);
  const cloudOverlay = ref<MaplibreLayer | null>(null);
  
  const coordinates = computed(() => [
    [imageBounds.value.sw.lng, imageBounds.value.ne.lat],
    [imageBounds.value.ne.lng, imageBounds.value.ne.lat],
    [imageBounds.value.ne.lng, imageBounds.value.sw.lat],
    [imageBounds.value.sw.lng, imageBounds.value.sw.lat],
  ] as maplibregl.Coordinates);


  function updateImageOverlay(map: maplibregl.Map) {
    if (map.getSource(imageOverlayId)) {
      (map.getSource(imageOverlayId) as maplibregl.ImageSource).updateImage({
        url: imageUrl.value,
        coordinates: coordinates.value
      });
    }
  }

  function updateCloudOverlay(map: maplibregl.Map) {
    if (map.getSource(cloudOverlayId)) {
      (map.getSource(cloudOverlayId) as maplibregl.ImageSource).updateImage({
        url: showClouds.value ? cloudUrl.value : '',
        coordinates: coordinates.value
      });
    }
  }

  function addOverlays(map: maplibregl.Map) {
    // Add image overlay
    map.addSource(imageOverlayId, {
      type: 'image',
      url: imageUrl.value,
      coordinates: coordinates.value
    });

    imageOverlay.value = {
      id: imageOverlayId,
      type: 'raster',
      source: imageOverlayId,
      paint: {
        'raster-opacity': opacity.value,
        'raster-resampling': 'nearest'
      }
    } as LayerSpecification;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.addLayer(imageOverlay.value as LayerSpecification);

    // Add cloud overlay
    map.addSource(cloudOverlayId, {
      type: 'image',
      url: showClouds.value ? cloudUrl.value : '',
      coordinates: coordinates.value
    });

    cloudOverlay.value = {
      id: cloudOverlayId,
      type: 'raster',
      source: cloudOverlayId,
      paint: {
        'raster-opacity': opacity.value,
        'raster-resampling': 'nearest',
      }
    } as LayerSpecification;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.addLayer(cloudOverlay.value as LayerSpecification);

    // Set up watchers
    watch(imageUrl, () => updateImageOverlay(map));
    watch([cloudUrl, showClouds], () => updateCloudOverlay(map));
    watch(opacity, (value: number) => {
      map.setPaintProperty(imageOverlayId, 'raster-opacity', value);
      map.setPaintProperty(cloudOverlayId, 'raster-opacity', value);
    });
    watch(imageBounds, () => {
      updateImageOverlay(map);
      updateCloudOverlay(map);
    });
  }

  return {
    imageOverlay,
    cloudOverlay,
    addOverlays,
  } as UseOverlaysType;
}
