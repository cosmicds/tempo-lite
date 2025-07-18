import { Ref, ref, onMounted, onUnmounted } from 'vue';
import M, { Map, AttributionControl } from 'maplibre-gl';
import { InitMapOptions, LatLngPair } from '@/types';


const scale = window.devicePixelRatio;
const retinaParam = scale > 1 ? '@2x' : '';

export interface MapLibreComposable {
    map: Ref<M.Map | null>;
    createMap: () => Ref<M.Map>;
    setView: (latlng: LatLngPair, zoom: number) => void;
    resetView: () => void;
    cleanupMap: () => void;
    getCenter: () => M.LngLat;
  }
  

  
export function useMap(id="map", options: InitMapOptions, _showRoads: Ref<boolean>, onReady?: (map: M.Map) => void): MapLibreComposable {
  // Something to know about MatLibre it likes longitude, latitude as opposed
  // to leaflet which uses latitude, longitude
  // this is where our map will be
  const map = ref<M.Map | null>(null);
  
  
  
  async function addCoastlines(map: M.Map) {
    fetch("coastlines.geojson")
      .then(response => response.json())
      .then(data => {
        map.addSource('coastline-custom', {
          'type': 'geojson',
          'data': data
        });
        map.addLayer({
          'id': 'coastline-custom',
          'type': 'line',
          'source': 'coastline-custom',
          'paint': {
            'line-color': 'black',
            'line-width': 1,
            'line-opacity': 0.8,
          }
        });
      });
  }
  
  function addLabels(map: M.Map) {
    return; // Stamen does mesh well with current map style
    map.addSource('stamen-toner-labels', {
      type: 'raster',
      tiles: [`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}${retinaParam}.png`],
      tileSize: 256,
    });

    map.addLayer({
      id: 'stamen-toner-labels',
      type: 'raster',
      source: 'stamen-toner-labels',
      minzoom: 0,
      maxzoom: 20
    });
  }
  
  function setupMap() {
    if (map.value === null) return;
    
    // Need to use weird type assertion to avoid
    // Type instantiation is excessively deep and possibly infinite.ts(2589)
    // See discussion here https://github.com/mapbox/mapbox-gl-js/issues/13203#issuecomment-2634013147
    const libreMap = map.value as unknown as M.Map;
    addCoastlines(libreMap);
    addLabels(libreMap);
    
    
    if (onReady !== undefined) {
      onReady(libreMap);
    }
  }

  function cleanupMap() {
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
  }
  
  // { MapLibre Demo Tiles
  //   container: id,
  //   style: 'https://demotiles.maplibre.org/style.json', // style URL
  //   center: options.loc ? [options.loc[1], options.loc[0]] : [0, 0], // starting position [lng, lat]
  //   zoom: options.zoom ?? 1 // starting zoom
  // }
  
  // { 
  //   container: id,
  //   style: 'https://tiles.openfreemap.org/styles/liberty', // style URL
  //   center: options.loc ? [options.loc[1], options.loc[0]] : [0, 0], // starting position [lng, lat]
  //   zoom: options.zoom ?? 1, // starting zoom,
  //   attributionControl: false
  // }
  
  // { CartoDB Positron
  //   container: id,
  //   style: 'https://{s}.basemaps.cartocdn.com/mapboxgl/style_tpl.json', // style URL
  //   center: options.loc ? [options.loc[1], options.loc[0]] : [0, 0], // starting position [lng, lat]
  //   zoom: options.zoom ?? 1 // starting zoom
  // }  
  function createMap(): Ref<M.Map> {
    const _map = new M.Map({
      container: id,
      // style: 'https://tiles.openfreemap.org/styles/liberty', // style URL
      style: 'https://demotiles.maplibre.org/style.json',
      center: options.loc ? [options.loc[1], options.loc[0]] : [0, 0], // starting position [lng, lat]
      zoom: options.zoom ?? 1, // starting zoom,
      attributionControl: false
    }).addControl(new AttributionControl({
      compact: true,
    }));
    
    _map.on('style.load', setupMap);
    
    map.value = _map;
    return map as unknown as Ref<M.Map>;
  }

  function setView(latlng: LatLngPair, zoom: number) {
    if (map.value) {
      map.value.setCenter([latlng[1], latlng[0]]);
      map.value.setZoom(zoom);
    }
  }
  
  function getCenter() {
    if (map.value) {
      return map.value.getCenter();
    }
  }
  
  // function getZoom() {
  //   if (map.value) {
  //     return map.value.getZoom();
  //   }
  // }
  
  function resetView() {
    if (map.value) {
      setView(options.loc, options.zoom);
    }
  }
  
  onMounted(() => {
    
  });

  onUnmounted(() => {
    cleanupMap();
  });

  return {
    map: map as Ref<M.Map | null>,
    createMap,
    setView,
    resetView,
    cleanupMap,
    getCenter
  } as MapLibreComposable;
}
