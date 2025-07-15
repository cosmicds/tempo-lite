import {ref, watch, Ref, toValue, onUnmounted} from 'vue';
import L from "leaflet";


import fieldOfRegard from "@/assets/TEMPO_FOR.json";
import augustFieldOfRegard from "@/assets/august_for.json";

export function useFieldOfRegard(date: Ref<Date>, map: Ref<L.Map | null>) {
  const showFieldOfRegard = ref(true);
  let usingAugust = true as boolean | null;

  
  const fieldOfRegardLayer = ref(L.geoJSON(
    fieldOfRegard as GeoJSON.GeometryCollection,
    {
      style: {
        color: "#c10124",
        fillColor: "transparent",
        weight: 1,
        opacity: 0.8,
      },
    }
  ));
  
  function updateFieldOfRegard() {
    if (date.value.getUTCFullYear() === 2023 && date.value.getUTCMonth() === 7) {
      fieldOfRegardLayer.value.clearLayers();
      fieldOfRegardLayer.value.addData(augustFieldOfRegard as GeoJSON.GeometryCollection);
      usingAugust = true;
    } else {
      if (usingAugust) { // only want this to run if it has to
        fieldOfRegardLayer.value.clearLayers();
        fieldOfRegardLayer.value.addData(fieldOfRegard as GeoJSON.GeometryCollection);
        usingAugust = false;
      }
    }
  }
  
  
  watch(showFieldOfRegard, (show: boolean) => {
    if (show && map.value) {
      fieldOfRegardLayer.value.addTo(map.value);
    } else if (map.value) {
      map.value.removeLayer(toValue(fieldOfRegardLayer) as L.Layer);
    }
  });

  watch(date, updateFieldOfRegard);
  
  function addFieldOfRegard() {
    if (showFieldOfRegard.value && map.value) {
      fieldOfRegardLayer.value.addTo(map.value);
    }
  }

  onUnmounted(() => {
    if (map.value) {
      map.value.removeLayer(toValue(fieldOfRegardLayer) as L.Layer);
    }
  });
  
  return {
    addFieldOfRegard,
    showFieldOfRegard,
    updateFieldOfRegard,
    fieldOfRegardLayer
  };
}