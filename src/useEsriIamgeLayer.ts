// /* eslint-disable @typescript-eslint/naming-convention */
// import { ref, computed, watch, onMounted } from 'vue';
// import * as esri from 'esri-leaflet';
// import { Map } from 'leaflet';


// export function useEsriLayer(map: Map, url: string) {
//   const imageLayer = ref<esri.ImageMapLayer | null>(null);
  
//   function createLayer() {
//     imageLayer.value = esri.imageMapLayer({
//       url: url,
//       format: 'jpg'
//     });
    
//     if (imageLayer.value) {
//       updateRenderingRule();
//       updateLayerTime();
//       imageLayer.value.addTo(map);
//     }
//   }
  
//   function updateRenderingRule() {
    
//     imageLayer.value?.setRenderingRule(raster);
//   }
  
//   function updateLayerTime(to: Date, from: Date) {
//     imageLayer.value?.setTimeRange(from, to);
//   }
  
  
    
    
// }
console.log('useEsriImageLayer.ts');