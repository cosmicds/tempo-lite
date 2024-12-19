
import { Ref, ref, watch } from "vue";
import L from "leaflet";
import fieldOfRegard from "./assets/TEMPO_FOR.json";
import augustFieldOfRegard from "./assets/august_for.json";

export function useFieldOfRegard(date: Ref<Date>, map: Ref<L.Map | null>) {
  const showFieldOfRegard = ref(true);
  const fieldOfRegardLayer = L.geoJSON(
    fieldOfRegard as GeoJSON.GeometryCollection,
    {
      style: {
        color: "#c10124",
        fillColor: "transparent",
        weight: 1,
        opacity: 0.8,
      },
    }
  ) as L.Layer;

  const fieldOfRegardLayerRef = ref(fieldOfRegardLayer);

  function updateFieldOfRegard() {
    if (date.value.getUTCFullYear() === 2023 && date.value.getUTCMonth() === 7) {
      (fieldOfRegardLayerRef.value as L.GeoJSON).clearLayers();
      (fieldOfRegardLayerRef.value as L.GeoJSON).addData(augustFieldOfRegard as GeoJSON.GeometryCollection);
    } else {
      (fieldOfRegardLayerRef.value as L.GeoJSON).clearLayers();
      (fieldOfRegardLayerRef.value as L.GeoJSON).addData(fieldOfRegard as GeoJSON.GeometryCollection);
    }
  }

  watch(showFieldOfRegard, (show: boolean) => {
    if (show) {
      fieldOfRegardLayerRef.value.addTo(map.value as L.Map);
    } else if (map.value) {
      map.value.removeLayer(fieldOfRegardLayerRef.value as L.Layer);
    }
  });

  watch(date, updateFieldOfRegard);
  
  function addFieldOfRegard() {
    if (showFieldOfRegard.value && map.value) {
      fieldOfRegardLayerRef.value.addTo(map.value);
    }
  }
  
  

  return {
    showFieldOfRegard,
    fieldOfRegardLayerRef,
    updateFieldOfRegard,
    addFieldOfRegard,
  };
}