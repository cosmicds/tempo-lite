// src/composables/useEsriLayer.ts
import { ref, watch, Ref, computed } from 'vue';
import { renderingRule, fetchEsriTimeSteps, extractTimeSteps } from '@/esri';
import { Map } from 'maplibre-gl';

export const no2Url = ref('https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer');
const ESRI_RENDERING_RULE = renderingRule;

interface UseEsriLayer {
  esriImageLayer: Ref<maplibregl.RasterTileSource | null>;
  esriOpacity: Ref<number>;
  noEsriData: Ref<boolean>;
  esriTimesteps: Ref<number[]>;
  getEsriTimeSteps: () => void;
  updateEsriOpacity: (value?: number | null | undefined) => void;
  updateEsriTimeRange: () => void;
  addEsriSource: () => void;
}

export function useEsriLayer(map: Ref<Map | null>, url: Ref<string>, timestamp: Ref<number>, opacity: Ref<number>): UseEsriLayer {
  const esriURL = ref(url);
  const esriLayerId = 'esri-source';
  const esriImageLayer = ref<maplibregl.RasterTileSource | null>(null);

  const esriTimesteps = ref([] as number[]);
  const esriOpacity = ref(opacity.value);
  const noEsriData = ref(false);
  
  const esriImageOptions = computed(() => {
    const options = {
      'format': 'png',
      'pixelType': 'U8',
      'size': '256,256',
      'transparent': true,
      'bboxSR': 3857,
      'imageSR': 3857,
      'bbox': '{bbox-epsg-3857}',
    };
    return  Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&');
    
  });
  
  
  
  function addEsriSource() {
    if (!map.value) return;
    
    
    
    map.value.addSource(esriLayerId, {
      type: 'raster',
      tiles: [
        `${esriURL.value}/exportImage?f=image&${esriImageOptions.value}&renderingRule=${encodeURIComponent(JSON.stringify(ESRI_RENDERING_RULE))}`,
      ],
      tileSize: 256,
    });
    
    map.value.addLayer({
      id: esriLayerId,
      type: 'raster',
      source:esriLayerId,
      paint: {
        'raster-resampling': 'nearest'
      },
    });
    
    esriImageLayer.value = map.value.getSource(esriLayerId) as  maplibregl.RasterTileSource;
    updateEsriTimeRange();
  }
  
  function updateEsriTimeRange() {
    if (!map.value) return;
    
    const time = esriTimeRange.value[0];
    console.log('time', new Date(time));
    const source = map.value.getSource(esriLayerId) as maplibregl.RasterTileSource;
    if (source) {
      const renderingRule = encodeURIComponent(JSON.stringify(ESRI_RENDERING_RULE));
      const newUrl = `${esriURL.value}/exportImage?f=image&${esriImageOptions.value}&time=${time}&renderingRule=${renderingRule}`;
      source.setTiles([newUrl]);
    } else {
      console.error('No source found');
    }
  }
  
  async function getEsriTimeSteps() {
    fetchEsriTimeSteps(esriURL.value)
      .then((json) => {
        esriTimesteps.value = extractTimeSteps(json);
      });
  }
  
  const esriTimeRange = computed(() => {
    if (esriTimesteps.value.length === 0) {
      return [timestamp.value, timestamp.value*2];
    }
    
    const nearest = esriTimesteps.value.reduce((a, b) => Math.abs(b - timestamp.value) < Math.abs(a - timestamp.value) ? b : a);
    console.log('nearest', new Date(nearest));
    return [nearest, nearest * 2];
  });
  

  watch(esriTimeRange, () => {
    if (map.value && map.value.getLayer(esriLayerId)) {
      updateEsriTimeRange();
    }
  });
  

  
  
  function updateEsriOpacity(value: number | null | undefined = undefined) {
    if (map.value && map.value.getLayer(esriLayerId)) {
      map.value.setPaintProperty(esriLayerId, 'raster-opacity', value ?? esriOpacity.value ?? 0.8);
    }
  }



  watch(esriOpacity, (_value: number) => {
    updateEsriOpacity();
  });

  watch(noEsriData, (value: boolean) => {
    if (value) {
      esriOpacity.value = 0;
      updateEsriOpacity();
    } else {
      updateEsriOpacity(opacity.value);
    }
  });

  return {
    esriImageLayer,
    esriOpacity,
    noEsriData,
    esriTimesteps,
    getEsriTimeSteps,
    updateEsriOpacity,
    updateEsriTimeRange,
    addEsriSource,
  } as UseEsriLayer;
}


