import { Ref, computed, watch } from 'vue';

export function useTempoFilenames(timestamp: Ref<number>, customImageUrl, useHighRes, fosterTimestamps, erdTimestamps, newTimestamps, cloudTimestamps) {
  function zpad(n: number, width: number = 2, character: string = "0"): string {
    return n.toString().padStart(width, character);
  }
  
  const date = computed(() => {
    return new Date(timestamp.value);
  });

  const imageName = computed(() => {
    return getTempoFilename(date.value);
  });

  function getTempoFilename(date: Date): string {
    return `tempo_${date.getUTCFullYear()}-${zpad(date.getUTCMonth() + 1)}-${zpad(date.getUTCDate())}T${zpad(date.getUTCHours())}h${zpad(date.getUTCMinutes())}m.png`;
  }

  function getTempoDataUrl(timestamp: number): string {
    if (fosterTimestamps.value.includes(timestamp)) {
      return 'https://tempo-images-bucket.s3.amazonaws.com/tempo-lite/';
    }

    if (erdTimestamps.value.includes(timestamp)) {
      return 'https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/early_release/images/';
    }

    if (newTimestamps.value.includes(timestamp)) {
      if (useHighRes.value) {
        return 'https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/released/images/';
      }
      return "https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/released/images/resized_images/";
    }

    return '';
  }
  
  function getCloudFilename(date: Date): string {
    const filename = getTempoFilename(date);
    if (useHighRes.value) {
      return 'https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/clouds/images/' + filename;
    } else {
      return 'https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/clouds/images/resized_images/' + filename;
    }
  }
  
  const imageUrl = computed(() => {
   
    if (customImageUrl.value) {
      return customImageUrl.value;
    }
    const url = getTempoDataUrl(timestamp.value);
    return url + imageName.value;
  });

  const cloudUrl = computed(() => {
    
    if (cloudTimestamps.value.includes(timestamp.value)) {
      return getCloudFilename(date.value);
    } 
    return '';
  });

  watch(timestamp, () => {
    // Trigger recomputation of imageUrl and cloudUrl when timestamp changes
    imageUrl.value;
    cloudUrl.value;
  });

  return {
    imageUrl,
    cloudUrl,
    getTempoDataUrl,
    getTempoFilename,
    getCloudFilename
  };
}
