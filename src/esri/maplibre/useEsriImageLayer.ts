import { ref, watch, Ref, MaybeRef, toRef, nextTick } from 'vue';
import { renderingRule, fetchEsriTimeSteps, extractTimeSteps, VariableNames } from '../ImageLayerConfig';
import { Map } from 'maplibre-gl';

import { ImageService } from 'mapbox-gl-esri-sources';


interface UseEsriLayer {
  esriImageSource: Ref<maplibregl.RasterTileSource | null>;
  opacity: Ref<number>;
  noEsriData: Ref<boolean>;
  esriTimesteps: Ref<number[]>;
  getEsriTimeSteps: () => void;
  updateEsriOpacity: (value?: number | null | undefined) => void;
  updateEsriTimeRange: () => void;
  addEsriSource: (Map) => void;
}

export function useEsriLayer(url: string, variableName: VariableNames, timestamp: Ref<number>, opacity: MaybeRef<number>): UseEsriLayer {

  const esriLayerId = 'esri-source';
  const esriImageSource = ref<maplibregl.RasterTileSource | null>(null);
  const map = ref<Map | null>(null);

  const esriTimesteps = ref([] as number[]);
  const opacityRef = toRef(opacity);
  const noEsriData = ref(false);
  
  const options = {
    'format': 'png',
    'pixelType': 'U8',
    'size': '256,256',
    'transparent': true,
    'bboxSR': 3857,
    'imageSR': 3857,
    'bbox': '{bbox-epsg-3857}',
    'interpolation': 'RSP_NearestNeighbor',
    'renderingRule': renderingRule,
  };
  const _esriImageOptions = Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&');
  
  function addLayer(map: Map | null | undefined) {

    if (map && !map.getLayer(esriLayerId)) {
      map.addLayer({
        id: esriLayerId,
        type: 'raster',
        source: esriLayerId,
        paint: {
          'raster-resampling': 'nearest',
          'raster-opacity': opacityRef.value ?? 0.8,
        },
      });
    }
  }
  
  function removeLayer(map: Map | null | undefined) {
    if (map && map.getLayer(esriLayerId)) {
      map.removeLayer(esriLayerId);
    }
  }
  
  const dynamicMapService = ref<ImageService | null>(null);
      
  
  function addEsriSource(_map: Map) {
    if (!_map) return;
    map.value = _map;
    
    dynamicMapService.value = new ImageService(
      esriLayerId,
      _map,
      {
        url: url,
        ...options
      },
      {
        tileSize: 256,
      }
    );


    
    addLayer(_map);
  }
  

  
  function updateEsriTimeRange() {
    if (!map.value) return;

    const time = timestamp.value;

    const nearest = esriTimesteps.value.length > 0 
      ? esriTimesteps.value.reduce((a, b) => Math.abs(b - time) < Math.abs(a - time) ? b : a)
      : time - 1000 * 60 * 15; 
    noEsriData.value = Math.abs((nearest - time) / (1000 * 60)) > 60;
    // noEsriData.value = nearest > 1752595200000; // Example condition (July 15, 2025 12pm ET for testing)
    if (noEsriData.value) {
      console.error('No ESRI data available for the selected time');
    }

    if (dynamicMapService.value && !noEsriData.value) {
      dynamicMapService.value.setDate(new Date(nearest), new Date(nearest * 2));
    } else if (!noEsriData.value) {
      // if there is esri coverage, then this is the issue
      console.error('Dynamic Map Service is not initialized');
    }
  }
  
  async function getEsriTimeSteps() {
    fetchEsriTimeSteps(url, variableName)
      .then((json) => {
        esriTimesteps.value = extractTimeSteps(json);
      }).then(() => {
        nextTick(updateEsriTimeRange);
      }).catch((error) => {
        console.error('Error fetching ESRI time steps:', error);
      });
  }
  


  watch(timestamp, (_value) => {
    updateEsriTimeRange();
  });

  
  
  function updateEsriOpacity(value: number | null | undefined = undefined) {
    if (map.value) {
      map.value.setPaintProperty(esriLayerId, 'raster-opacity', value ?? opacityRef.value ?? 0.8);
    }
  }


  watch(opacityRef, (_value: number) => {
    updateEsriOpacity(_value);
  });

  watch(noEsriData, (value: boolean) => {
    if (value) {
      updateEsriOpacity(0);
      removeLayer(map.value as Map | null);
    } else {
      addLayer(map.value as Map | null);
    }
  });

  return {
    esriImageSource,
    opacity: opacityRef,
    noEsriData,
    esriTimesteps,
    getEsriTimeSteps,
    updateEsriOpacity,
    updateEsriTimeRange,
    addEsriSource,
  } as UseEsriLayer;
}


