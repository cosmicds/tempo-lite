import {Ref, ref, watch} from 'vue';
import M, {Marker} from 'maplibre-gl';
import { LatLngPair } from '@/types';


interface MaplibreLocationMarker {
  locationMarker: Ref<M.Marker | null>;
  setMarker: (latlng: LatLngPair) => void;
  removeMarker: () => void;
  showLocationMarker: Ref<boolean>;
}

export function useLocationMarker( map: Ref<M.Map | null>, show: boolean): MaplibreLocationMarker {
  
  const showLocationMarker = ref(show);
  const locationMarker = ref<null | Marker>(null);
  
  
  const addToMap = () => {
    console.log('in add to map');
    if (locationMarker.value !== null && map.value !== null) {
      console.log('adding to map');
      locationMarker.value.addTo(map.value);
    }
  };
  
  function setMarker(latlng: LatLngPair) {
    console.log('setting maker');
    if (!map.value) return ;
    console.log('really setting maker');
    
    const lnglat = [latlng[1], latlng[0]] as M.LngLatLike;
    
    if (locationMarker.value == null) {
      
      locationMarker.value = new M.Marker()
        .setLngLat(lnglat);
      
    } else {
      locationMarker.value.setLngLat(lnglat);
    }
    
    if (showLocationMarker.value) {
      addToMap();
    }
  }
  
  function removeMarker() {
    locationMarker.value?.remove();
  }
  
  watch(showLocationMarker, (show: boolean) => {
    if (show) {
      addToMap();
    } else {
      removeMarker();
    }
  });
  
  return {
    locationMarker: locationMarker as Ref<M.Marker | null>,
    setMarker,
    removeMarker,
    showLocationMarker
  };
}