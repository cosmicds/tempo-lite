import { Ref, ref, watch } from "vue";
import maplibregl from "maplibre-gl";
import fieldOfRegard from "./assets/TEMPO_FOR.json";
import augustFieldOfRegard from "./assets/august_for.json";

export function useFieldOfRegard(date: Ref<Date>, map: Ref<maplibregl.Map | null>) {
  const showFieldOfRegard = ref(true);
  const fieldOfRegardLayerId = "field-of-regard";

  function updateFieldOfRegard() {
    if (!map.value) return;
    // if (!map.value.isStyleLoaded()) return;

    const data = date.value.getUTCFullYear() === 2023 && date.value.getUTCMonth() === 7
      ? augustFieldOfRegard
      : fieldOfRegard;

    if (map.value.getSource(fieldOfRegardLayerId)) {
      (map.value.getSource(fieldOfRegardLayerId) as maplibregl.GeoJSONSource).setData(data as GeoJSON.GeometryCollection);
    } else {
      map.value.addSource(fieldOfRegardLayerId, {
        type: "geojson",
        data: data as GeoJSON.GeometryCollection,
      });

      map.value.addLayer({
        id: fieldOfRegardLayerId,
        type: "line",
        source: fieldOfRegardLayerId,
        paint: {
          "line-color": "#c10124",
          "line-width": 1,
          "line-opacity": 0.8,
        },
      });
    }
  }

  watch(showFieldOfRegard, (show: boolean) => {
    if (!map.value) return;
    
    if (show) {
      updateFieldOfRegard();
    } else {
      if (map.value.getLayer(fieldOfRegardLayerId)) {
        map.value.removeLayer(fieldOfRegardLayerId);
      }
      if (map.value.getSource(fieldOfRegardLayerId)) {
        map.value.removeSource(fieldOfRegardLayerId);
      }
    }
  });

  watch(date, () => {
    if (map.value && !map.value.isStyleLoaded()) return;
    updateFieldOfRegard();
  });

  function addFieldOfRegard() {
    if (showFieldOfRegard.value && map.value) {
      updateFieldOfRegard();
    }
  }

  return {
    showFieldOfRegard,
    updateFieldOfRegard,
    addFieldOfRegard,
  };
}
