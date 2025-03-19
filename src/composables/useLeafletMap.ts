import { ref, onMounted } from 'vue';
import L, { Map } from 'leaflet';

export interface InitMapOptions {
  loc: L.LatLngExpression | number[],
  zoom: number,
  // allow other options
  [x: string | number | symbol]: unknown
}

export function useLeafletMap(id="map", options: InitMapOptions) {
  
  // this is where our map will be
  const map = ref<Map | null>(null);
  const basemap = ref<L.TileLayer.WMS | null | L.TileLayer>(null);
  const labelmap = ref<L.TileLayer.WMS | null | L.TileLayer>(null);
  
  async function addCoastlines() {
    fetch("coastlines.geojson")
      .then(response => response.json())
      .then(data => {
        L.geoJson(data, {
          style: { color: "black", weight: 1, opacity: 0.8 }
        }).addTo(map.value as Map);
      });
  }
  
  function setupMap() {
    if (map.value === null) return;
    
    // we need a pane that will be at a high z-index
    const labelPane = map.value.createPane("labels");
    labelPane.style.zIndex = "650";
    labelPane.style.pointerEvents = "none";
    
    // add Stadia Toner lines only
    basemap.value = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      pane: 'labels'
    });
    basemap.value.addTo(map.value as Map);
    
    // add Stadia Toner labels only
    labelmap.value = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      pane: 'labels'
    });
    labelmap.value.addTo(map.value as Map);
    
    addCoastlines();
  }
  
  function createMap() {
    map.value = L.map(id, { zoomControl: false });
    map.value.setView(options.loc as L.LatLngTuple, options.zoom);
    
    map.value.whenReady(setupMap);
  }

  function setView(latlng: [number, number] | L.LatLngExpression, zoom: number) {
    if (map.value) {
      map.value.setView(latlng, zoom);
    }
  }
  
  function resetView() {
    if (map.value) {
      map.value.setView(options.loc as L.LatLngTuple, options.zoom);
    }
  }
  
  
  onMounted(() => {
    createMap();
  });

  return {
    map,
    setView,
    resetView
  };
}