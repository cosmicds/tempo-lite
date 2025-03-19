import { ref, computed, watch, Ref } from 'vue';
import { getTimezoneOffset } from 'date-fns-tz';

const ONEDAYMS = 1000 * 60 * 60 * 24;

function isBad(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}


export const useUniqueTimeSelection = (timestamps: Ref<number[]>) => {
  const timeIndex = ref(0);
  const singleDateSelected = ref<Date>(new Date());
  const minIndex = ref<number>(0);
  const maxIndex = ref<number>(0);
  

  watch(timestamps, () => {
    singleDateSelected.value = uniqueDays.value[uniqueDays.value.length - 1];
  });
  
  function getOneDaysTimestamps(date: Date): number[] {
    if (isBad(date)) {
      return [];
    }
    const mod = timestamps.value.filter(ts => ((ts - date.getTime()) < ONEDAYMS) && (ts - date.getTime()) > 0);
    return mod;
  }
  
  function setNearestDate(date: number | null) {
    if (date == null) {
      return;
    }

    const mod = getOneDaysTimestamps(new Date(date));
    minIndex.value = timestamps.value.indexOf(mod[0]);
    maxIndex.value = timestamps.value.indexOf(mod[mod.length - 1]);
    timeIndex.value = minIndex.value;
  }
  
  const timestamp = computed(() => {
    const val = timestamps.value[timeIndex.value];
    return val;
  });
  
  const date = computed(() => {
    return new Date(timestamp.value);
  });
  
  const offset = (date: Date) => getTimezoneOffset("US/Eastern", date);
  
  const uniqueDays = computed(() => {
    // easter time cuz we want USA days
    const easternDates = timestamps.value.map(ts => new Date(ts + offset(new Date(ts))));
    const days = easternDates.map(date => (new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime());
    const unique = Array.from(new Set(days));
    return unique.map(ts => new Date(ts));
  });
  
  const uniqueDaysIndex = (ts: number) => {
    let date = new Date(ts + offset(new Date(ts)));
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return uniqueDays.value.map(e => e.getTime()).indexOf(date.getTime());
  };
  
  
  function getUniqueDayIndex(date: Date | null | undefined): number {
    if (isBad(date)) {
      return 0;
    }
    return uniqueDays.value.findIndex(day => day.getTime() === date.getTime());
  }
  
  function moveBackwardOneDay() {
    singleDateSelected.value = uniqueDays.value[getUniqueDayIndex(singleDateSelected.value) - 1];
  }
  
  function moveForwardOneDay() {
    singleDateSelected.value = uniqueDays.value[getUniqueDayIndex(singleDateSelected.value) + 1];
  }
  
  function nearestDate(date: Date): number {
    const time = date.getTime();
    const timestamp = timestamps.value.find(ts => ((ts - time) < ONEDAYMS) && (ts - time) >= 0);
    if (timestamp !== undefined) {
      return timestamp;
    } else {
      console.warn("No matching timestamp found, returning default value.");
      return timestamps.value[0];
    }
  }
  
  function nearestDateIndex(date: Date): number {
    const timestamp = date.getTime();
    const index = timestamps.value.findIndex(ts => ((ts - timestamp) < ONEDAYMS) && (ts - timestamp) >= 0);
    if (index === null) {
      console.log("No matching timestamp found, returning default index.");
    }
    return index ?? 0;
  }
  
  watch(singleDateSelected, (value) => {
    console.log("singleDateSelected.value", value);
    setNearestDate(value.getTime());
  });
  
  
  return {
    timeIndex,
    timestamp,
    date,
    singleDateSelected,
    maxIndex,
    minIndex,
    uniqueDays,
    uniqueDaysIndex,
    setNearestDate, // did an image preload
    getUniqueDayIndex,
    moveBackwardOneDay,
    moveForwardOneDay,
    nearestDate,
    nearestDateIndex
  };

};