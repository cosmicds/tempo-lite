import {Ref, watch} from 'vue';
import 'leaflet.zoomhome';
import L, {Map} from 'leaflet';
import { LatLngPair } from '@/types';

export function usezoomhome(map: Ref<Map | null>, home: LatLngPair, zoom: number, callback: CallableFunction = () => null) {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const zoomHome = L.Control.zoomHome({ homeCoordinates: home, homeZoom: zoom });
  const originalZH = zoomHome._zoomHome.bind(zoomHome);
  zoomHome._zoomHome = (_e: Event) => {
    originalZH();
    callback();
  };
  
  if (map.value !== null) {
    zoomHome.addTo(map.value);
  }
  
  watch(map, (newValue) => {
    if (newValue !== null) {
      zoomHome.addTo(map.value);
    }
  });
  
  
  return zoomHome;

}
