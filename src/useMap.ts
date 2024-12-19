import { ref } from 'vue';
import L, { Map } from 'leaflet';
import 'leaflet.zoomhome';

export function useMap() {
  const map = ref<Map | null>(null);
  const basemap = ref<L.TileLayer.WMS | null | L.TileLayer>(null);
  
  function setView(latlng: [number, number] | L.LatLngExpression, zoom: number) {
    if (map.value) {
      map.value.setView(latlng, zoom);
    }
  }
  
  async function addCoastlines() {
    fetch("coastlines.geojson")
      .then(response => response.json())
      .then(data => {
        L.geoJson(data, {
          style: { color: "black", weight: 1, opacity: 0.8 }
        }).addTo(map.value as Map);
      });
  }
  
  function onMapLoad() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const labelPane = map.value.createPane("labels");
    labelPane.style.zIndex = "650";
    labelPane.style.pointerEvents = "none";


    basemap.value = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      pane: 'labels'
    }).addTo(map.value as Map);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      pane: 'labels'
    }).addTo(map.value as Map);
  }
    

  function initializeMap(id="map") {
    map.value = L.map(id, { zoomControl: false }).setView([40.044, -98.789], 4, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      crs: L.CRS.EPSG4326
    });
    
    map.value.whenReady(onMapLoad);

    
  }
  
  // onMounted(() => {
  //   initializeMap();
  // });
  
  return {
    map,
    setView,
    addCoastlines,
    basemap,
    initializeMap
  };
}
