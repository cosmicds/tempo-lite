import { ref, Ref } from 'vue';
import maplibregl, { Map, NavigationControl, LngLat } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CDSMaplibreHomeTool } from './MaplibreHomeTool';

const scale = window.devicePixelRatio;
const retinaParam = scale > 1 ? '@2x' : '';

interface UseMapType {
  map: Ref<Map | null>;
  setView: (latlng: [number, number], zoom: number) => void;
  addCoastlines: () => void;
  basemap: ReturnType<typeof ref>;
  initializeMap: (containerId: string, onMapLoad: () => void) => void;
}

export function useMap(): UseMapType {
  const map = ref<Map | null>(null);
  const basemap = ref<null>(null);
  
  const startingCenter: [number, number] = [-98.789, 40.044];
  const startingZoom = 2.5;

  function setView(latlng: [number, number], zoom: number) {
    if (map.value) {
      console.log('Setting view to', latlng, zoom);
      const coord = new LngLat(latlng[1], latlng[0]);
      map.value.setCenter(coord);
      map.value.setZoom(zoom);
    }
  }

  async function addCoastlines() {
    if (!map.value) return;

    const response = await fetch("coastlines.geojson");
    const data = await response.json();

    map.value.addSource('coastlines', {
      type: 'geojson',
      data: data
    });

    map.value.addLayer({
      id: 'coastlines',
      type: 'line',
      source: 'coastlines',
      paint: {
        'line-color': 'black',
        'line-width': 1,
        'line-opacity': 0.8
      }
    });
  }

  function _onMapLoad() {
    if (!map.value) return;

    map.value.addSource('stamen-toner-labels', {
      type: 'raster',
      tiles: [`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}${retinaParam}.png`],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    map.value.addLayer({
      id: 'stamen-toner-labels',
      type: 'raster',
      source: 'stamen-toner-labels',
      minzoom: 0,
      maxzoom: 20
    });

    // Set the basemap reference
    // basemap.value = map.value.getLayer('stamen-toner-lines');
  }

  function initializeMap(containerId: string = 'map', onMapLoad = () => {}) {
    map.value = new maplibregl.Map({
      container: containerId,
      style: 'https://tiles.stadiamaps.com/styles/stamen_toner_lines.json', // https://docs.stadiamaps.com/map-styles/stamen-toner/
      center: startingCenter,
      zoom: startingZoom
    });
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.value.on('style.load', () => {
      console.log('Map loaded');
      _onMapLoad();
      onMapLoad();
    });

    // Add zoom and rotation controls to the map.
    map.value.addControl(new NavigationControl({showCompass: false}), 'top-left');
    map.value.addControl(new CDSMaplibreHomeTool(startingCenter, startingZoom), 'top-left');

    // Add a scale control
    // map.value.addControl(new ScaleControl(), 'bottom-left');

    // Add a fullscreen control
    // map.value.addControl(new maplibregl.FullscreenControl());
  }

  return {
    map,
    setView,
    addCoastlines,
    basemap,
    initializeMap
  } as UseMapType;
}
