// src/composables/useEsriLayer.ts
import { ref, watch, nextTick, MaybeRef, toRef, Ref } from 'vue';
import { ImageMapLayer, imageMapLayer } from 'esri-leaflet';
import { renderingRule, fetchEsriTimeSteps, extractTimeSteps, type VariableNames } from '../ImageLayerConfig';
import { Map } from 'leaflet';
export const no2Url = ref('https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer');



export function useEsriLayer(url: string, variableName: VariableNames, timestamp: Ref<number>, opacity: MaybeRef<number>) {
  let esriTimesteps: number[] = [];
  const esriImageLayer = ref(null as ImageMapLayer | null);

  const opacityRef = toRef(opacity);

  const noEsriData = ref(false);



  async function getEsriTimeSteps() {
    fetchEsriTimeSteps(url, variableName)
      .then((json) => {
        esriTimesteps = extractTimeSteps(json);
        nextTick(updateEsriTimeRange);
      });
  }


  function updateEsriTimeRange() {
    const now = timestamp.value;
    if (esriTimesteps.length === 0) {
      console.warn('No ESRI time steps available');
      return;
    }
    
    const nearest = esriTimesteps.reduce((a, b) => Math.abs(b - now) < Math.abs(a - now) ? b : a);
    noEsriData.value = Math.abs((nearest - now) / (1000 * 60)) > 60;
    if (noEsriData.value) {
      console.error('nearest time is more than an hour away');
    }
    if (esriImageLayer.value) {
      // Esri will pick the first valid time slice
      // console.table({'nearest': new Date(nearest), 'now': new Date(now), 'diff (minutes)': (nearest - now) / (1000 * 60) });
      esriImageLayer.value.setTimeRange(new Date(nearest), new Date(nearest * 2));
    }
  }

  function updateEsriOpacity(value: number = 0.8) {
    if (esriImageLayer.value) {
      esriImageLayer.value.setOpacity(value);
    }
  }


  esriImageLayer.value = imageMapLayer({
    url: url,
    format: 'png',
    opacity: opacityRef.value ?? 0.8,
  });
  
  if (esriImageLayer.value) {
    // esriImageLayer.value.setPixelType(renderingRule?.rasterFunctionArguments?.Raster?.outputPixelType ?? 'U8');
    esriImageLayer.value.setRenderingRule(renderingRule);
    updateEsriTimeRange();
  }


  function addEsriSource(map: Map) {
    if (!map) return;
    esriImageLayer.value?.addTo(map);
  }

  watch(timestamp, (_value: number) => {
    updateEsriTimeRange();
  }, { immediate: true });

  watch(opacityRef, (value: number) => {
    updateEsriOpacity(value);
  });

  watch(noEsriData, (value: boolean) => {
    if (value) {
      updateEsriOpacity(0);
    } else {
      updateEsriOpacity(opacityRef.value);
    }
  });

  return {
    esriImageLayer,
    opacity: opacityRef,
    noEsriData,
    esriTimesteps,
    getEsriTimeSteps,
    updateEsriTimeRange,
    updateEsriOpacity,
    addEsriSource,
  };
}