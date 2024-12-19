// src/composables/useEsriLayer.ts
import { ref, watch, Ref, nextTick } from 'vue';
import * as esri from 'esri-leaflet';
import { renderingRule, fetchEsriTimeSteps, extractTimeSteps } from '@/esri';
import { Map } from 'leaflet';
export const no2Url = ref('https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer');

export function useEsriLayer(map: Ref<Map | null>, url: Ref<string>, timestamp: Ref<number>, opacity: Ref<number>) {
  const esriURL = ref(url);
  const esriTimesteps = ref([] as number[]);
  const esriImageLayer = ref(null as esri.ImageMapLayer | null);
  const esriOpacity = ref(opacity.value);
  const noEsriData = ref(false);
  
  
  
  async function getEsriTimeSteps() {
    fetchEsriTimeSteps(esriURL.value)
      .then((json) => {
        esriTimesteps.value = extractTimeSteps(json);
        nextTick(updateEsriTimeRange);
      });
  }


  function updateEsriTimeRange() {
    const now = timestamp.value;
    if (esriTimesteps.value.length === 0) {
      return;
    }
    const nearest = esriTimesteps.value.reduce((a, b) => Math.abs(b - now) < Math.abs(a - now) ? b : a);
    // console.log(nearest, new Date(nearest), new Date(now), (nearest - now) / (1000 * 60));
    noEsriData.value = Math.abs((nearest - now) / (1000 * 60)) > 60;
    if (noEsriData.value) {
      console.error('nearest time is more than an hour away');
    }
    if (esriImageLayer.value) {
      esriImageLayer.value.setTimeRange(new Date(nearest), new Date(nearest * 2));
    }
  }

  function updateEsriOpacity(value: number | null | undefined = undefined) {
    if (esriImageLayer.value) {
      esriImageLayer.value.setOpacity(value ?? esriOpacity.value ?? 0.8);
    }
  }

  
  esriImageLayer.value = esri.imageMapLayer({
    url: esriURL.value,
    format: 'png',
    opacity: opacity.value,
  });

  esriImageLayer.value.setPixelType('U8');
  if (esriImageLayer.value) {
    esriImageLayer.value.setRenderingRule(renderingRule);
    esriImageLayer.value.setOpacity(0.9);
    updateEsriTimeRange();
  }
  
  function addEsriSource() {
    if (!map.value) return;
    esriImageLayer.value?.addTo(map.value);
  }

  watch(timestamp, (_value: number) => {
    updateEsriTimeRange();
  });

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
    updateEsriTimeRange,
    updateEsriOpacity,
    addEsriSource,
  };
}