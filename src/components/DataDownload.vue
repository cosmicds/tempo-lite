<template>
  <v-card>
    <v-card-text class="data-download-stuff">
      <div class="data-image" v-if="dataUrl" >
      <img 
        
        :style="{ 'height': '150px', 'width': (150 * aspectRatio) + 'px' }"
        
        :src="dataUrl" 
        alt="Data Image" 
        />
      </div>
      <v-progress-linear striped v-else indeterminate height="30" color="primary">Loading Image....</v-progress-linear>
      <div class="mt-4">
      <div class="text-small">
      Right click above, or <a class="download-link" :href="dataUrl" download="data_image.png">Click here<v-icon>mdi-download-outline</v-icon></a> to download the image
      </div>
      <div class="dds-links">
        
        <div class="dds-link-item">
          <div class="dds-link-item-label">
            View/download the TEMPO data for <br/> {{ date }} at {{ time }} UTC: 
          </div>
          <div class="dds-link-item-links">
            <a :href="earthdata_url_time" target="_blank" rel="noopener noreferrer">
              View in NASA Earthdata <v-icon size="small">mdi-open-in-new</v-icon>
            </a>
          </div>
        </div>
        
      <div class="dds-link-item">
        <div class="dds-link-item-label">
          View/download all TEMPO data for {{ date }}:
        </div>
        <div class="dds-link-item-links">
          <a :href="earthdata_url_day" target="_blank" rel="noopener noreferrer">
            View in NASA Earthdata <v-icon size="small">mdi-open-in-new</v-icon>
          </a>
        </div>
      </div>

      <div class="dds-link-item">
        <div class="dds-link-item-label">
          View TEMPO data in NASA Worldview!
        </div>
        <div class="dds-link-item-links">
          <a :href="worldview_url" target="_blank" rel="noopener noreferrer">
            Open in NASA Worldview
            <v-icon size="small">mdi-open-in-new</v-icon>
          </a>
        </div>
        <!-- <div v-if="inVersion4">
          NASA Worldview currently only has TEMPO Version 3 data available.
        </div> -->
      </div>
    </div>
      
  </div>
    </v-card-text>
  </v-card>
</template>


<script setup lang="ts">
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted } from 'vue';
import html2canvas from 'html2canvas';
import type { Map } from 'leaflet';

const props = defineProps<{
  timestamp: number;
  map: Map;
}>();
const dataUrl = ref('');

const html = document.getElementById('map');
const aspectRatio = ref(0);

// import { hideLeafletControls, showLeafletControls } from '@/canvas_downloader';
onMounted(() => {
  setTimeout(() => {
    if (!html) {
      console.error('Map element not found');
      return;
    }
    const { width, height } = html.getBoundingClientRect();
    aspectRatio.value = width / height;
    html2canvas(html as HTMLElement, {
      useCORS: true, 
      imageTimeout: 0,
      scale: 2,
      width: Math.floor(width) ,
      height: Math.floor(height),
      
      ignoreElements(el) {
        // Hide the Leaflet controls
        if (el.classList.contains('leaflet-control')) {
          return true;
        }
        return false;
      }
    }).then((canvas) => {
      dataUrl.value = canvas.toDataURL('image/png');
    }).finally(() => {
    });
    
  }, 1000);
});

const worldview_stem = "https://worldview.earthdata.nasa.gov";
// a default US veiw
const view = [-144.17194981608017, 12.354034875358575, -51.61926955194661, 61.4143092037926]; 
const ics = true;
const ici = 5;
const icd = 30;
const layers = {
  'Reference_Features_15m': {'hidden': false},
  'TEMPO_L3_Formaldehyde_Vertical_Column': {'hidden': true},
  'TEMPO_L3_NO2_Vertical_Column_Stratosphere': {'hidden': true},
  'TEMPO_L3_NO2_Vertical_Column_Troposphere': {'hidden': false},
  'TEMPO_L3_Cloud_Cloud_Fraction_Total': {'hidden': true},
  'TEMPO_L3_Cloud_Cloud_Pressure_Total': {'hidden': true},
  'TEMPO_L3_Ozone_Column_Amount': {'hidden': true},
  'TEMPO_L3_Ozone_Cloud_Fraction': {'hidden': true},
  'TEMPO_L3_Ozone_UV_Aerosol_Index': {'hidden': true},
  'OSM_Land_Mask': {'hidden': false}
};
const layer_string = Object.keys(layers).map(function (key) {
  return key + (layers[key].hidden ? '(hidden)' : '');
}).join(',');
const lg = true;

const inVersion4 = props.timestamp > new Date('2025-09-17 15:00').getTime();
const d = inVersion4 ? new Date('2025-09-17 15:00') : new Date(props.timestamp);
const t = d.toISOString().split('T')[0] + '-T18:00:00Z';

let params = new URLSearchParams({
  v: view.join(','),
  ics: ics.toString(),
  ici: ici.toString(),
  icd: icd.toString(),
  l: layer_string,
  lg: lg.toString(),
  t: t
});
const worldview_url = `${worldview_stem}/?${params.toString()}`;

const earthdata_stem = "https://search.earthdata.nasa.gov/search";

const timeDate = new Date(props.timestamp).toISOString();
const time = new Date(props.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const date = new Date(props.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const start = timeDate.split('T')[0] + 'T00:00:00.000Z';
const end = timeDate.split('T')[0] + 'T23:59:59.999Z';
params = new URLSearchParams({
  fpj: 'TEMPO',
  qt: `${start},${end}`,
  fl: '3+-+Gridded+Observations',
}); 
const earthdata_url_day = `${earthdata_stem}?${params.toString()}`;

// narrow to the time
params = new URLSearchParams({
  fpj: 'TEMPO',
  qt: `${timeDate},${timeDate}`,
  fl: '3+-+Gridded+Observations',
});

const earthdata_url_time = `${earthdata_stem}?${params.toString()}`;

</script>

<style>
.data-download-stuff {
  display: flex;
  flex-direction: column;
  font-size: 1.3em;
  overflow: scroll;
  justify-content: center;
}

.data-download-stuff .data-image {
  margin-inline: auto;
}

.data-download-stuff a.download-link {
  font-weight: bold;
  color: var(--smithsonian-blue);
  text-decoration: none;
  height: 1em;
}

.dds-links {
  border-top: 2px solid #1976d2;
  border-bottom: 2px solid #1976d2;
  font-size: 0.8em;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  row-gap: 5px;
}



.dds-link-item::before {
  content: "⭐ ";
}

.dds-link-item {
  display: flex;
  justify-content: left;
  align-items: center;
  border-bottom: 1px solid var(--smithsonian-blue);
  padding-block: 5px;
}

.dds-link-item div.dds-link-item-label {
  flex-grow: 1;
  padding-left: 1rem;;
}

.dds-link-item div.dds-link-item-links {
  flex-grow: 0;
  text-align: right;
}

.dds-link-item a {
  font-size: 0.9em;
  padding: 5px 10px;
  color: #333;
  background-color: var(--smithsonian-blue);
  border-radius: 5px;
  text-wrap: nowrap;
  box-sizing: content-box;
  
}
</style>