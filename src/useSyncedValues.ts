import { Ref, watch } from "vue";

export function useSyncedValues<T>(
  value1: Ref<T>,
  value2: Ref<T>,
  sync: Ref<boolean>
) {
  watch([value1, sync], () => {
    if (sync.value && value2.value !== value1.value) {
      value2.value = value1.value;
    }
  });

  watch([value2, sync], () => {
    if (sync.value && value1.value !== value2.value) {
      value1.value = value2.value;
    }
  });
}
