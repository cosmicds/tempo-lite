import {Ref, ref} from 'vue';
import L, {Marker, Map} from 'leaflet';

export function useLocationMarker( map: Ref<Map | null>, show: boolean) {
  
  const showLocationMarker = ref(show);
  const locationMarker = ref<null | Marker>(null);
  
  
  const icon = L.icon({
    ...L.Icon.Default.prototype.options,
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
  
  function setMarker(latlng: L.LatLngExpression) {
    if (locationMarker.value == null) {
      locationMarker.value = new L.Marker(latlng, { icon: icon, pane: 'markers', opacity: 0.8 });
    } else {
      locationMarker.value.setLatLng(latlng);
    }
    
    if (showLocationMarker.value && map.value !== null) {
      locationMarker.value.addTo(map.value);
    }
  }
  
  function removeMarker() {
    locationMarker.value?.remove();
    locationMarker.value = null;
  }
  
  return {
    locationMarker,
    setMarker,
    removeMarker,
    showLocationMarker,
  };
}