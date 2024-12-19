<template>
<v-app
  id="app"
  :style="cssVars"
>
<v-overlay
  :model-value="inIntro"
  :style="cssVars"
  id="intro-background"
>

<v-dialog 
  v-model="inIntro"
        >
        <div v-if="inIntro" id="introduction-overlay" class="elevation-10 gradient-background">
          <v-window v-model="introSlide">
            <template v-slot:additional>
              <div id="intro-window-close-button">
              <font-awesome-icon
                size="xl"
                class="ma-1"
                color="#b3d5e6"
                icon='square-xmark'
                @click="inIntro = !inIntro"
                @keyup.enter="inIntro = !inIntro"
                tabindex="0"
                tooltip-location="start"
              /> 
            </div>
            </template>
            <v-window-item :value="1">
              <div class="intro-text">
                <p class="mb-5">
                  The TEMPO satellite mission (Tropospheric Emissions: Monitoring Pollution), launched in April 2023, is the first space-based instrument to monitor major air pollutants across the North American continent every daylight hour at high spatial resolution. A collaboration between NASA and the Smithsonian Astrophysical Observatory, the TEMPO instrument gathers hourly daytime scans of the atmosphere over North America from the Atlantic Ocean to the Pacific Coast and from roughly Mexico City to central Canada.
                </p>
              </div>
            </v-window-item>
            
            <v-window-item :value="2">
              <div class="intro-text mb-3">
                <p class="mb-3">
                  This Data Story provides an introduction to what can be learned from TEMPO’s data, which became publicly available May 20, 2024. The map here visualizes hourly Nitrogen Dioxide (NO<sub>2</sub>) data over time. NO<sub>2</sub> can be produced by:
                </p> 
                <ul>
                  <li>Burning of fossil fuels&#8212;for example from vehicles, power plants, manufacturing sites, and oil refineries</li>
                  <li>Fires and biomass burning&#8212;including wildfires and prescribed burns, as well as burning of vegetation for land clearing</li>
                  <li>Bacteria, which naturally convert nitrogen in soil into compounds that can form NO<sub>2</sub>. Agricultural use of nitrogen-based fertilizers increases the amount of NO<sub>2</sub> produced by these bacteria.</li>
                  <li>Lightning, which triggers a chemical reaction that turns harmless N<sub>2</sub> in the atmosphere into NO<sub>2</sub>.
</li>
                </ul>
                <p class="mt-3">
                For each date, you can see the scans beginning on the East Coast in the morning, and ending on the West Coast as the Sun sets.
                </p> 
              </div>
            </v-window-item>
            <v-window-item :value="3">
              <div class="intro-text mb-3">      
                <p class="mb-3">
                  In this interactive page you can:
                </p>
                <ul>
                  <li>
                    Select a date and press the “Play” button or scroll the time slider to view the changing concentrations of NO<sub>2</sub> over North America on those dates. 
                  </li>
                  <li v-bind:style="cssVars">
                    Press the <v-icon style="font-size: 1.3em; color: var(--accent-color)" elevation="1">mdi-information-variant-circle-outline</v-icon> button next to each Notable Date to get an overview of what to look for on that date
                  </li>
                  <li>
                    For each Notable Date, select one of two zoomed-in Locations to investigate specific pollution events.
                  </li>
                  <li>
                    You can use the “Timezone” setting to investigate how pollution evolves over the day, for example as rush hour progresses in large cities.
                  </li>
                </ul>
                <!-- add do not show introduction again button -->
                <v-checkbox
                  v-model="dontShowIntro"
                  @keyup.enter="dontShowIntro = !dontShowIntro"
                  label="Don't show this introduction again"
                  color="#c10124"
                  hide-details
                />
              </div>
            </v-window-item>
          </v-window>

          <div id="intro-bottom-controls">
            <div>
              <v-btn
                v-if="(introSlide > 1)"
                id="intro-next-button"
                :color="accentColor"
                @click="introSlide--"
                @keyup.enter="introSlide--"
                elevation="0"
                >
                Back
              </v-btn>
            </div>
            
            <v-btn
              id="intro-next-button"
              :color="accentColor"
              @click="introSlide++"
              @keyup.enter="introSlide++"
              elevation="0"
              >
              {{ introSlide < 3 ? 'Next' : 'Get Started' }}
            </v-btn>
          </div>
        </div>
      </v-dialog>
    </v-overlay>
  <div
    id="main-content"
  > 
    <div class="content-with-sidebars">
      <!-- tempo logo -->
      <div id="logo-title">
      <a href="https://tempo.si.edu" target="_blank" rel="noopener noreferrer" >
        <img 
          src="./assets/TEMPO-Logo-Small.png"
          alt="TEMPO Logo"
          style="width: 100px; height: 100px;"
        >
      </a>

      <h1 id="title">What is in the Air You Breathe?</h1>
      </div>
      <div id="where" class="big-label">where</div>
      <div id="map-container">
        <colorbar-horizontal
          v-if="$vuetify.display.width <= 750"
          label="Amount of NO2"
          backgroundColor="transparent"
          :nsteps="255"
          :cmap="cbarNO2RGB"
          start-value="1"
          end-value="150"
          :extend="true"
        >
        <template v-slot:label>
              <div style="text-align: center;">Amount of NO&#x2082;&nbsp;<span class="unit-label">(10&sup1;&#x2074; mol/cm&sup2;)</span></div>
        </template>
        </colorbar-horizontal>
        <div id="map-contents" style="width:100%; height: 100%;">
          <v-alert
            id="search-error"
            type="error"
            v-model="noEsriData"
            text="The ESRI Image server does not have data for this date & time."
          >
          </v-alert>
          <div id="map"></div>
          <div v-if="showFieldOfRegard" id="map-legend"><hr class="line-legend">TEMPO Field of Regard</div>
          <!-- show hide cloud data, disable if none is available -->

          <v-menu
            id="map-controls"
            v-model="showControls"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <div id="map-show-hide-controls">
                <v-btn
                  v-bind="props"
                  class="mx-2 mt-5"
                  elevation="2"
                  color="white"
                  icon
                  style="outline: 2px solid #b6b6b6;"
                  rounded="0"
                  size="x-small"
                >
                  <template v-slot:default>
                    <v-icon
                      color="black"
                      size="x-large"
                    >mdi-tune-variant</v-icon>
                  </template>
                </v-btn>
              </div>
            </template>
            <v-card class="controls-card">
              <font-awesome-icon
                style="position:absolute;right:16px;cursor:pointer"
                icon="square-xmark"
                size="xl"
                @click="showControls = false"
                @keyup.enter="showControls = false"
                :color="accentColor2"
                tabindex="0"
              ></font-awesome-icon>
              <div
                id="opacity-slider-container"
                class="mt-5"
              >
                <div id="opacity-slider-label">TEMPO data opacity</div>
                <v-slider
                    v-model="opacity"
                    :min="0"
                    :max="1"
                    color="#c10124"
                    density="compact"
                    hide-details
                    class="mb-4"
                  >
                </v-slider>
              </div>
              <div>
                <v-btn @click="singleOpacity = !singleOpacity">
                  <v-icon>{{ singleOpacity ? 'mdi-link-variant' : 'mdi-link-variant-off' }}</v-icon>
                </v-btn>
              </div>
              <div
                id="opacity-slider-container"
                class="mt-0"
              >
                <div id="opacity-slider-label">ESRI data opacity</div>
                <v-slider
                    v-model="esriOpacity"
                    :min="0"
                    :max="1"
                    color="#c10124"
                    density="compact"
                    hide-details
                    class="mb-4"
                  >
                </v-slider>
              </div>
              <div
                class="d-flex flex-row align-center justify-space-between"
              >
                <v-checkbox
                  v-model="showFieldOfRegard"
                  @keyup.enter="showFieldOfRegard = !showFieldOfRegard"
                  label="TEMPO Field of Regard"
                  color="#c10124"
                  hide-details
                />
                <info-button>
                  <p>
                    The TEMPO satellite observes the atmosphere over North America, from the Atlantic Ocean to the Pacific Coast, and from roughly Mexico City to central Canada. 
                  </p>
                  <p>
                    The TEMPO Field of Regard (in <span class="text-red">red</span>, currently <em>{{ showFieldOfRegard ? 'visible' : "hidden" }}</em>)
                    is the area over which the satellite takes measurements. 
                  </p>
                  </info-button>
                </div>
                <div class="d-flex flex-row align-center justify-space-between">
                <v-checkbox
                  v-model="showClouds"
                  @keyup.enter="showClouds = !showClouds"
                  :disabled="!cloudDataAvailable"
                  :label="cloudDataAvailable ? 'Show Cloud Mask' : 'No Cloud Data Available'"
                  color="#c10124"
                  hide-details
                />
                <info-button>
                  <p>
                    The cloud mask shows where the satellite could not measure NO<sub>2</sub> because of cloud cover. 
                  </p>
                </info-button>
              </div>
            </v-card>
          </v-menu>

          <location-search
            v-model="searchOpen"
            small
            stay-open
            buttonSize="xl"
            persist-selected
            :search-provider="geocodingInfoForSearchLimited"
            @set-location="(feature: MapBoxFeature) => {
              if (feature !== null) {
                setView([feature.center[1], feature.center[0]], 12);
              }
            }"
            @error="(error: string) => searchErrorMessage = error"
          ></location-search>
        </div>
        <colorbar 
          v-if="displayWidth > 750"
          label="Amount of NO2"
          backgroundColor="transparent"
          :nsteps="255"
          :cmap="cbarNO2RGB"
          start-value="1"
          end-value="150"
          :extend="true"
        >
          <template v-slot:label>
              <div style="text-align: center;">Amount of NO&#x2082;<br><span class="unit-label">(10&sup1;&#x2074; molecules/cm&sup2;)</span></div>
          </template>
        </colorbar>
        

      </div>
        <div id="when" class="big-label">when</div>
        <div id="slider-row">
          <v-slider
            class="time-slider"
            v-model="timeIndex"
            :min="minIndex"
            :max="maxIndex"
            :step="1"
            color="#068ede95"
            thumb-label="always"
            :track-size="10"
            show-ticks="always"
            hide-details
            :disabled="loadedImagesProgress < 100"
          >
            <template v-slot:thumb-label>
              <div class="thumb-label">
                {{ thumbLabel }}
              </div>
            </template>
          </v-slider>
          <icon-button
            id="play-pause"
            :fa-icon="playing ? 'pause' : 'play'"
            fa-size="sm"
            @activate="playing = !playing"
          ></icon-button>
        </div>

        

       <div id="user-options">
        <div id="all-dates">
          <h2>Select a Date</h2>  
          <div class="d-flex flex-row align-center">
            <v-radio-group v-model="radio">
              <date-picker
                ref="calendar"
                :model-value="singleDateSelected"
                @internal-model-change="(value: Date) => {
                  if (value != null && value.getTime() != singleDateSelected.getTime()) {
                    singleDateSelected = value;
                    $refs.calendar.closeMenu();
                  }
                }"
                :allowed-dates="uniqueDays"
                :clearable="false"
                :enable-time-picker="false"
                :multi-dates="false"
                :transitions="false"
                :format="(date: Date | null) => date?.toDateString()"
                :preview-format="(date: Date | null) => date?.toDateString()"
                no-today
                dark
              >
                <template #action-buttons></template>
              </date-picker>
            </v-radio-group>
          </div>        
          <!-- create a list of the uniqueDays -->
          <!-- <v-select
            :modelValue="singleDateSelected"
            :disabled="radio !== 0"
            :items="uniqueDays"
            item-title="title"
            item-value="value"
            label="Select a Date"
            @update:model-value="(e) => { singleDateSelected = e;}"
            hide-details
            variant="solo"
          ></v-select> -->
          <!-- add buttons to increment and decrement the singledateselected -->
          <div class="d-flex flex-row align-center my-2">
            <v-tooltip :disabled="touchscreen" text="Previous Date">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="rounded-icon-wrapper"
                  @click="moveBackwardOneDay"
                  @keyup.enter="moveBackwardOneDay"
                  :disabled="radio !== null || singleDateSelected === uniqueDays[0]"
                  color="#009ade"
                  variant="outlined"
                  elevation="0"
                  size="md"
                >
                  <v-icon>mdi-chevron-double-left</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip :disabled="touchscreen" text="Next Date">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="rounded-icon-wrapper"
                  @click="moveForwardOneDay"
                  @keyup.enter="moveForwardOneDay"
                  :disabled="radio !== null || singleDateSelected === uniqueDays[uniqueDays.length - 1]"
                  color="#009ade"
                  variant="outlined"
                  elevation="0"
                  size="md"
                >
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
          <v-progress-linear
            v-model="loadedImagesProgress"
            color="#c10124"
            height="20"
          >
          <span v-if="loadedImagesProgress < 100">Loading Data ({{ loadedImagesProgress.toFixed(0) }}%)</span>
          <span v-else>Selected Date Loaded</span>
          </v-progress-linear>
        </div>

        <hr style="border-color: grey">


         <div id="date-radio">
           <!-- make a v-radio-group with 3 options -->
          <h2>Notable Dates</h2>
          <v-radio-group
            v-model="radio"
            row
          >
            <div v-for = "(event, index) in interestingEvents" :key="index" class="d-flex flex-row align-center">
              <v-radio
                :label="event.label"
                :value="index"
                @keyup.enter="radio = index"
              >
              </v-radio>
              <info-button>
                <div style="display: inline-block; margin: 0; padding: 0;" v-html="event.info"></div>
              </info-button>
            </div>
            
          </v-radio-group>
        </div>
        
        <hr style="border-color: grey;"  v-if="radio !== null ">
        
        <div id="locations-of-interest" v-if="radio !== null">
          <h3 class="mb-1">Featured Events for {{ dateStrings[radio] }}</h3>
          <v-radio-group
            v-if="radio !== null"
            v-model="sublocationRadio"
            row
          >
          <div
            v-for="(loi, index) in locationsOfInterest[radio]" 
            v-bind:key="index" 
            class="sublocation-radio-wrapper d-flex flex-row align-center space-between">
            <v-radio
              class="sublocation-radio"
              :label="loi.text"
              :value="index"
              @keyup.enter="sublocationRadio = index"
            ></v-radio>
            <info-button>
              <p v-html="locationsOfInterestText[radio][index]"></p>
            </info-button>
          </div>
          </v-radio-group>
        </div>

        <hr style="border-color: grey;">
        <div id="bottom-options">
          <br>
          <v-select
            v-model="selectedTimezone"
            label="Timezone"
            :items="timezoneOptions"
            item-title="name"
            item-value="tz"
          ></v-select>
          <v-checkbox
            v-if="false"
            :disabled="!highresAvailable"
            v-model="useHighRes"
            @keyup.enter="useHighRes = !useHighRes"
            label="Use High Resolution Data"
            color="#c10124"
            hide-details
          />
        </div>
      </div>
      
      <div id="information">
      <article>
        <h2>TEMPO NO<sub>2</sub> Data</h2>
        <p>
          <a href="https://tempo.si.edu" target="_blank" rel="noopener noreferrer" >
          TEMPO</a>, a collaboration between the Smithsonian and NASA, is the first space-based probe to measure air pollution hourly over North America at neighborhood scales. NO<sub>2</sub> (nitrogen dioxide) is one of the pollutants detected by TEMPO. It is produced by wildfires and the burning of fossil fuels. NO<sub>2</sub> contributes to the formation of harmful ground-level ozone and toxic particulates in the air we breathe.
        </p>

          <div class="d-flex flex-row justify-space-between">
          <a tabindex="0">
            Credits
            <v-dialog
              id="credits-dialog"
              v-model="showCredits"
              activator="parent"
              :scrim="false"
              location="center center"
            >
              <v-card class="dialog-card">
                <font-awesome-icon
                    style="position:absolute;right:16px;cursor:pointer;padding:0.5em;margin:-0.5em"
                    icon="square-xmark"
                    size="xl"
                    @click="showCredits = false"
                    @keyup.enter="showCredits = false"
                    :color="accentColor2"
                    tabindex="0"
                  ></font-awesome-icon>
                <v-card-title tabindex="0"><h3>Credits</h3></v-card-title>
                <v-card-text>
                  <h4 class="mb-2"><a href="https://tempo.si.edu/" target="_blank" rel="noopener noreferrer">TEMPO</a> Team Acknowledgments:</h4>
                  <p>
                    Caroline Nowlan, Aaron Naeger, and Erika Wright provided dates and featured events of interest in the TEMPO data.
                  </p>
                  <p>
                    Xiong Liu provided the L3 version 2 TEMPO data files.
                  </p>
                  <p>
                    Heesung Chong provided the shape file for the TEMPO field of regard.
                  </p>

                  <p class="my-3">NASA's Scientific Visualization Studio provided the TEMPO NO<sub>2</sub> colormap.</p>

                  <h4 class="mb-2"><a href="https://www.cosmicds.cfa.harvard.edu/" target="_blank" rel="noopener noreferrer">CosmicDS</a> Team:</h4> 

                  Jonathan Foster<br>
                  Jon Carifio<br>
                  John Lewis<br>
                  Pat Udomprasert<br>
                  Alyssa Goodman<br>
                  Erika Wright<br>
                  Mary Dussault<br>
                  Harry Houghton<br>
                  Evaluator: Sue Sunbury<br>

                  <funding-acknowledgement class="my-3"></funding-acknowledgement>
                </v-card-text>
              </v-card>
            </v-dialog>
          </a>
          <!-- make small inline show introduction link button -->
          <a href="#" @click="inIntro = true" @keyup.enter="inIntro = true" style="right: 0;">
            Show Introduction
          </a>
        </div>

      </article>
      </div>
      
    </div>
    <div id="body-logos">
      <a href="https://www.si.edu/" target="_blank" rel="noopener noreferrer" class="mr-1" 
      ><img alt="Smithsonian Logo" src="./assets/smithsonian.png"
        /></a>
      <credit-logos/>
    </div>
  </div>
</v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, Ref } from "vue";
// import  L, { Map } from "leaflet";
import { Map } from "maplibre-gl";

import { getTimezoneOffset } from "date-fns-tz";
import { cbarNO2 } from "./revised_cmap";
import { MapBoxFeature, MapBoxFeatureCollection, geocodingInfoForSearch } from "./mapbox";
import { _preloadImages } from "./PreloadImages";
import { getTimestamps } from "./timestamps";
import { SheetType, Timeout, InterestingEvent, LatLng, LatLngBounds } from "./types";
import { useDisplay } from 'vuetify';
import { useTempoFilenames } from "./useTempoFilenames";
import { useFieldOfRegard } from "./useFieldOfRegard-Maplibre";
import { useOverlays } from "./useOverlays-Maplibre";
import { useMap } from "./useMap-Maplibre";
import { useSyncedValues } from "./useSyncedValues";

const urlParams = new URLSearchParams(window.location.search);
const hideIntro = urlParams.get("hideintro") === "true";
const WINDOW_DONTSHOWINTRO = hideIntro ? true : window.localStorage.getItem("dontShowIntro") === 'true';

const sheet = ref<SheetType>(null);
const accentColor = ref("#068ede");
const accentColor2 = ref("#ffd302");
const introSlide = ref(1);
const inIntro = ref(!WINDOW_DONTSHOWINTRO);
const dontShowIntro = ref(WINDOW_DONTSHOWINTRO);
const touchscreen = ref(false);
const {smAndDown, width: displayWidth } = useDisplay();
const smallSize = computed(() =>  smAndDown);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mobile = computed(() => { return smallSize.value && touchscreen.value; });
const showSplashScreen = ref(new URLSearchParams(window.location.search).get("splash")?.toLowerCase() !== "false");
touchscreen.value = ('ontouchstart' in window) || ('ontouchstart' in document.documentElement) || !!window.navigator.msPointerEnabled;
const searchOpen = ref(true);
const searchErrorMessage = ref<string | null>(null);
const showControls = ref(false);
const showCredits = ref(false);
const customImageUrl = ref("");


const cssVars = computed(() => {
  return {
    '--accent-color': accentColor.value,
    '--accent-color-2': accentColor2.value,
    '--app-content-height': showTextSheet.value ? '66%' : '100%',
  };
});

const showTextSheet = computed({
  get() {
    return sheet.value === 'text';
  },
  set(_value: boolean) {
    selectSheet('text');
  }
});



function selectSheet(name: SheetType) {
  if (sheet.value === name) {
    sheet.value = null;
    nextTick(() => {
      blurActiveElement();
    });
  } else {
    sheet.value = name;
  }
}

watch(introSlide, (val: number) => {
  inIntro.value = val < 4;
});

watch(dontShowIntro, (val: boolean) => {
  window.localStorage.setItem("dontShowIntro", val.toString());
  if (!val) {
    inIntro.value = true;
  }
});





const novDecBounds = new LatLngBounds(
  new LatLng(17.025, -154.975),
  new LatLng(63.975, -24.475)
);

const marchBounds = new LatLngBounds(
  new LatLng(14.01, -167.99),
  new LatLng(72.99, -13.01)
);

const bounds = ref(marchBounds.toBBoxString().split(",").map(parseFloat));

const newBounds = computed(() => {
  return new LatLngBounds(
    new LatLng(bounds.value[1], bounds.value[0]),
    new LatLng(bounds.value[3], bounds.value[2])
  );
});




const useHighRes = ref(false);
const showClouds = ref(false);
const opacity = ref(0.9);

const singleOpacity = ref(false);

const erdTimestamps = ref<number[]>([]);
const newTimestamps = ref<number[]>([]);
const cloudTimestamps = ref<number[]>([]);
const fosterTimestamps = ref<number[]>([
  1698838920000, 1698841320000, 1698843720000, 1698846120000, 1698848520000, 1698852120000, 1698855720000, 1698859320000, 1698862920000, 1698866520000, 1698870120000, 1698873720000, 1698876120000, 1698878520000, 1698880920000, 1699011720000, 1699014120000, 1699016520000, 1699018920000, 1699021320000, 1699024920000, 1699028520000, 1699032120000, 1699035720000, 1699039320000, 1699042920000, 1699046520000, 1699048920000, 1699051320000, 1699053720000, 1711626180000, 1711628640000, 1711631040000, 1711633440000, 1711637040000, 1711640640000, 1711644240000, 1711647840000, 1711651440000, 1711655040000, 1711658640000, 1711662240000, 1711665840000, 1711668240000,
]);



async function updateTimestamps() {
  return getTimestamps().then((ts) => {
    erdTimestamps.value = ts.early_release;
    newTimestamps.value = ts.released;
    timestamps.value = timestamps.value.concat(erdTimestamps.value, newTimestamps.value).sort();
    cloudTimestamps.value = ts.clouds;
  });
}


import { useUniqueTimeSelection } from "./useUniqueTimeSelection";
const timestamps = ref<number[]>(fosterTimestamps.value);
const { 
  timeIndex,
  timestamp,
  date,
  singleDateSelected,
  maxIndex,
  minIndex,
  uniqueDays,
  setNearestDate,
  moveBackwardOneDay,
  moveForwardOneDay,
  nearestDateIndex } = useUniqueTimeSelection(timestamps);

const cloudDataAvailable = computed(() => {
  return cloudTimestamps.value.includes(timestamp.value);
});

updateTimestamps().then(() => {
  singleDateSelected.value = uniqueDays.value[uniqueDays.value.length - 1];
});

    
const { imageUrl, cloudUrl, getCloudFilename, getTempoDataUrl, getTempoFilename } = useTempoFilenames(timestamp, customImageUrl, useHighRes, fosterTimestamps, erdTimestamps, newTimestamps, cloudTimestamps);


const imageBounds = computed(() => {
  if (date.value.getUTCFullYear() === 2023) {
    return novDecBounds;
  } else if (date.value.getUTCFullYear() === 2024 && date.value.getUTCMonth() === 2) {
    return marchBounds;
  } else {
    return newBounds.value;
  }
});



const { addOverlays } = useOverlays(imageUrl, cloudUrl, showClouds, opacity, imageBounds);
// import 'leaflet.zoomhome';

import { no2Url, useEsriLayer} from './useEsriLayer-Maplibre';


const { map, initializeMap, addCoastlines, setView } = useMap();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { addEsriSource, noEsriData, esriOpacity, getEsriTimeSteps } = useEsriLayer(map as Ref<Map | null>, no2Url, timestamp, opacity);
getEsriTimeSteps();
useSyncedValues(opacity, esriOpacity, singleOpacity);

const { showFieldOfRegard, addFieldOfRegard } = useFieldOfRegard(date, map as Ref<Map>);
onMounted(() => {
  showSplashScreen.value = false;
  const onLoad = () => {
    addCoastlines();
    addOverlays(map.value as Map);
    addFieldOfRegard();
    addEsriSource();
  };
  try {
    initializeMap('map', onLoad);
  } catch (e) {
    console.error(e);
  }
});





// only get's changed directly with the radio button or forward/backward buttons
watch(singleDateSelected, (value: Date) => {
  console.log('singleDateSelected changed (TempoLite.vue)');
  const timestamp = value.getTime();
  const index = datesOfInterest.value.map(d => d.getTime()).indexOf(timestamp);
  imagePreload();
  radio.value = index < 0 ? null : index;
});


const dateStrings = computed(() => {
  return interestingEvents.value.map(event => event.dateString);
});

const selectedTimezone = ref("US/Eastern");
const dateIsDST = computed(() => {
  const standardOffset = getTimezoneOffset(selectedTimezone.value, new Date(date.value.getUTCFullYear(), 0, 1));
  const currentOffset = getTimezoneOffset(selectedTimezone.value, date.value);
  if (standardOffset === currentOffset) {
    return false;
  }
  return true;
});

const timezoneOptions = computed(() => {
  return [
    { tz: 'US/Eastern', name: dateIsDST.value ? 'Eastern Daylight' : 'Eastern Standard' },
    { tz: 'US/Central', name: dateIsDST.value ? 'Central Daylight' : 'Central Standard' },
    { tz: 'US/Mountain', name: dateIsDST.value ? 'Mountain Daylight' : 'Mountain Standard' },
    { tz: 'US/Arizona', name: 'Mountain Standard' },
    { tz: 'US/Pacific', name: dateIsDST.value ? 'Pacific Daylight' : 'Pacific Standard' },
    { tz: 'US/Alaska', name: dateIsDST.value ? 'Alaska Daylight' : 'Alaska Standard' },
    { tz: 'UTC', name: 'UTC' },
  ];
});

const thumbLabel = computed(() => {
  const offset = getTimezoneOffset(selectedTimezone.value, date.value);
  const dateWithOffset = new Date(timestamp.value + offset);
  const hours = dateWithOffset.getUTCHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  let hourValue = hours % 12;
  if (hourValue === 0) {
    hourValue = 12;
  }
  return `${date.value.getUTCMonth() + 1}/${dateWithOffset.getUTCDate()}/${dateWithOffset.getUTCFullYear()} ${hourValue}:${dateWithOffset.getUTCMinutes().toString().padStart(2, '0')} ${amPm}`;
});








/* HANDLE LOCATION OF INTEREST SELECTION */

const radio = ref<number | null>(null);
const sublocationRadio = ref<number | null>(null);

import _interestingEvents from "./locationsOfInterest";
const interestingEvents = ref<InterestingEvent[]>(_interestingEvents as InterestingEvent[]);

const datesOfInterest = computed(() => {
  return interestingEvents.value.map(event => event.date);
});

const locationsOfInterest = computed(() => {
  return interestingEvents.value.map(event =>
    event.locations.map(loc => ({
      ...loc,
      index: nearestDateIndex(new Date(loc.time)),
    }))
  );
});

const locationsOfInterestText = computed(() => {
  return interestingEvents.value.map(event =>
    event.locations.map(loc => loc.description)
  );
});


watch(radio, (value: number | null) => {
  if (value == null) {
    setNearestDate(singleDateSelected.value.getTime());
    sublocationRadio.value = null;
    return;
  }
  const date = datesOfInterest.value[value] ?? singleDateSelected.value;
  singleDateSelected.value = date;
  setNearestDate(date.getTime());
  sublocationRadio.value = null;
});

watch(sublocationRadio, (value: number | null) => {
  if (value !== null && radio.value != null) {
    const loi = locationsOfInterest.value[radio.value][value];
    setView(loi.latlng, loi.zoom);
    if (loi.index !== undefined) {
      timeIndex.value = loi.index;
    } else {
      console.warn('No index found for location of interest');
    }
  }
});


/* HANDLE IMAGE AND CLOUD DATA OVERLAYS */



// convenience function only for debugging
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const whichDataSet = computed(() => {
  if (fosterTimestamps.value.includes(timestamp.value)) {
    return 'TEMPO-lite';
  }
  if (erdTimestamps.value.includes(timestamp.value)) {
    return 'Early Release (V01)';
  }
  if (newTimestamps.value.includes(timestamp.value)) {
    return 'Level 3 (V03)';
  }
  return 'Unknown';
});






const highresAvailable = computed(() => {
  return newTimestamps.value.includes(timestamp.value);
});


function cbarNO2RGB(x: number): string {
  const rgb = cbarNO2(0, 1, x);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},1)`;
}




async function geocodingInfoForSearchLimited(searchText: string): Promise<MapBoxFeatureCollection | null> {
  return geocodingInfoForSearch(searchText, {
    countries: ["US", "CA", "MX", "CU", "BM", "HT", "DO"],
    limit: 10,
  }).catch(_err => null);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resetMapBounds() {
  setView([40.044, -98.789], 4);
}

const playing = ref(false);
const playInterval = ref<Timeout | null>(null);

function play() {
  playInterval.value = setInterval(() => {
    if (timeIndex.value >= maxIndex.value) {
      timeIndex.value = minIndex.value;
    } else {
      timeIndex.value += 1;
    }
  }, 1000);
}

function pause() {
  if (playInterval.value) {
    clearInterval(playInterval.value);
  }
}

watch(playing, (playVal: boolean) => {
  if (playVal) {
    play();
  } else {
    pause();
  }
});


const preload = ref(true);
const loadedImagesProgress = ref(0);
function imagePreload() {
  if (!preload.value) {
    return;
  }
  console.log('preloading images for ', thumbLabel.value);
  const times = timestamps.value.slice(minIndex.value, maxIndex.value + 1);
  const images = times.map(ts => getTempoDataUrl(ts) + getTempoFilename(new Date(ts)));
  const cloudImages = times.filter(ts => cloudTimestamps.value.includes(ts)).map(ts => getCloudFilename(new Date(ts)));
  images.push(...cloudImages);
  const promises = _preloadImages(images);
  let loaded = 0;
  loadedImagesProgress.value = 0;
  promises.forEach((promise) => {
    promise.then(() => {
      loaded += 1;
      loadedImagesProgress.value = (loaded / promises.length) * 100;
    }).catch((err) => {
      console.log('error loading image', err);
    });
  });
}

watch(loadedImagesProgress, (val: number) => {
  playing.value = false;
  const btn = document.querySelector('#play-pause-button');
  if (btn) {
    if (val < 100) {
      btn.setAttribute('disabled', 'true');
    } else {
      btn.removeAttribute('disabled');
    }
  }
});


function blurActiveElement() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}


watch(useHighRes, () => {
  imagePreload();
});




</script>

<style lang="less">
@font-face {
  font-family: "Highway Gothic Narrow";
  src: url("./assets/HighwayGothicNarrow.ttf");
}

// import Lexand from google fonts
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');

:root {
  // font-size: clamp(14px, 1.7vw, 16px);
  // --default-font-size: 1rem; // we don't use this
  font-size: 16px; // this is the standard browser default
  --default-line-height: clamp(1rem, min(2.2vh, 2.2vw), 1.6rem); // we don't use this
  --smithsonian-blue: #009ade;
  --smithsonian-yellow: #ffcc33;
  --info-background: #092088;
  --map-height: 500px;
}

.dp__theme_dark {
  --dp-primary-text-color: #fff !important; // selected date text
  --dp-primary-color: var(--accent-color)!important; // selected date background
}

.dp__month_year_select,
.dp__calendar_item {
  color: #97c8f1!important; // selectable date text & Month/Year
  font-weight: 800 !important;
}

.dp__cell_disabled {
  color: #888 !important;
  font-weight: 400;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
  overflow: hidden;

  
  -ms-overflow-style: none;
  // scrollbar-width: none;
}

body {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;

  font-family: Verdana, Arial, Helvetica, sans-serif;
}

a {
  text-decoration: none;
  color: var(--smithsonian-yellow);
}

ul {
  margin-left: 1rem;
}

#intro-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.7); 
  z-index: 100;
}

.gradient-background {
    // rotated translucent background gradient
    background: linear-gradient(45deg,
                              rgb(14, 30, 40), 
                              rgb(22, 50, 65), 
                              rgb(30 70 90));
  }

#introduction-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: fit-content;
  // outline: 5px solid var(--accent-color);
  border-radius: 1em;
  z-index: 1000;

  @media (max-width: 700px) {
    width: 95%;
    padding: 1em;
  }

  @media (min-width: 701px) {
    width: 75%;
    padding: 2em;
  }

  .span-accent {
    color: var(--accent-color);
  }


  
  //font-size: calc(1.1 * var(--default-font-size));
  // line-height: var(--default-line-height);

  .v-list-item {
    color: #eee;
  }
  
  .intro-text {
    color: white;
    font-size: 1em;
    line-height: 1.5em;
  }
  
  strong {
    color: white;
  }
  
  div#intro-bottom-controls {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    gap: 1em;
    margin-top:0.5em;

    .v-btn.v-btn--density-default {
        max-height: calc(1.6 * var(--default-line-height));
      }  

    .v-btn--size-default {
      font-size: calc(0.9 * var(--default-font-size));
    }    
    
    #intro-next-button {
      background-color: rgba(18, 18, 18,.5);
    }
  }
}

#intro-window-close-button {
    position: absolute;
    top: 0.25em;
    right: 0.25em;

    &:hover {
      cursor: pointer;
    }
}

#main-content {
  position: fixed;
  width: 100%;
  height: var(--app-content-height);
  overflow: auto;
  transition: height 0.1s ease-in-out;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#map {
  width: 100%;
  height: var(--map-height)
}

// define the layout
.content-with-sidebars {
  position: relative;
  padding: 0;
  
  display: grid;
  grid-template-columns: 0 .8fr .3fr;
  grid-template-rows: 70px var(--map-height) 78px .5fr .5fr;
  gap: 20px 10px;
  
  > * {
    background-color: transparent;
  }
  
  > div {
    outline: 1px solid transparent;
  }
  
  #user-options {
    min-width: 200px;
    margin-left: 1.5rem;
    grid-column: 3 / 4;
    grid-row: 2 / 3;
  }
  
  #logo-title {
    display: flex;
    align-items: center;
    grid-column: 2 / 4;
    grid-row: 1 / 2;
    gap: 10px;
  }

  #where {
    display: none;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  
  #map-container {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
  
  #when {
    display: none;
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
  
  #slider-row {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  #information {
    padding: 1rem;
    grid-column: 2 / 3;
    grid-row: 4 / 6;
  }

}

// style the content 
#main-content {
  padding: 2rem;
}

.content-with-sidebars {
  font-family: "Lexend", sans-serif;
  font-optical-sizing: auto;
  font-weight: normal;
  font-style: normal;
  background-color: transparent;
}

#title {
  color: var(--smithsonian-yellow);
  font-weight: 600;
  font-size: 2.5rem;
  text-align: left;
  text-wrap: nowrap;
}

a[href="https://tempo.si.edu"] > img {
  // display: inline;
  height: 70px!important;
  width: auto !important;
}

#information {
  background-color: var(--info-background);
  border-radius: 10px;
  padding-inline: 1rem;
  // margin-right: 200px;
}

a {
  text-decoration: underline;
  font-weight: bold;
  color: var(--accent-color-2);
}

.v-dialog > .v-overlay__content > .v-card {
  padding: 1rem;
}

.v-overlay__content {
    align-self: center;
    margin: unset;
  }

  .v-card-text {
    height: 40vh;
  }

#credits-dialog {
  display: flex;
  width: calc(100% - 1rem);
}

.dialog-card {
  align-self: center;
  max-width: 80%;
}

// prevent overflows of the content
#user-options {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px; 
}

#date-radio {
  padding-block: 0.5rem;
}

#all-dates {
  padding-bottom: 0.5rem;
}

#locations-of-interest {
  border: 1px solid black;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  height: fit-content;

  h3 {
    font-weight: 500;
  }
}

.big-label {
  font-size: 2rem;
  text-align: right;
  margin-right: 0.5rem;
  align-self: end;
  color: var(--smithsonian-blue);
}

#when {
  align-self: start;
}

#slider-row, #when {
  margin-top: 1.5rem;
}

#slider-row {
  margin-left: 3rem;
}
#map-container {
  position: relative;
  display: flex;
  flex-direction: row;
  padding-right: 10px;

  #map {
    flex-basis: 80%;
    flex-grow: 1;
    flex-shrink: 1;
  }
  
  .forward-geocoding-container {
    position: absolute;
    bottom: 0;
    left: 0;
    
    z-index: 1000;
    width: 250px;
    border: 2px solid black;
  }
  
  #map-show-hide-controls {
    z-index: 1000;
    position: absolute;
    top: 1rem;
    right: 80px;
  }

  #map-legend {
    position: absolute;
    top: 0;
    right: 80px;
    width: fit-content;
    z-index: 1000;
    
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    color: black;
    background-color: #fff5;
    padding-left: 0.5rem;
    padding-right: 0.25rem;
    
    backdrop-filter: blur(5px);
    
    hr.line-legend {
      display: inline-block;
      border: 0.5px solid #c10124;
      width: 3rem;
    }
  }

   .colorbar-container {
    flex-grow: 0;
    flex-shrink: 1;

    .unit-label {
      font-size: .95em;
    }
  }
}

#slider-row {
  display: flex;
  flex-direction: row;
  padding-left: 0;
  
  > #play-pause-button {
    height: fit-content;
    align-self: center;
    padding-inline: 0.5rem;
    margin-left: 0.75rem;
    width: 2.5rem;
    color: var(--accent-color);
    border: 2px solid var(--accent-color);
  }
  
  #play-pause-button[disabled] {
    filter: grayscale(100%);
    cursor: progress;
    cursor: not-allowed;
  }

  .icon-wrapper {
    padding-inline: 0.5rem !important;
  }
}

.time-slider {

  .v-slider-thumb {

    .v-slider-thumb__surface::after {
      background-image: url("./assets/smithsonian.png");
      background-size: 30px 30px;
      height: 30px;
      width: 30px;
    }
    
    .v-slider-thumb__label {
      background-color: var(--accent-color-2);
      border: 0.25rem solid var(--accent-color);
      width: max-content;
      height: 2.5rem;
      font-size: 1rem;
    
      &::before {
        color: var(--accent-color);
      }
    }
  }

  .v-slider-track__tick {
      background-color: var(--accent-color); /* Change color */
      height: 15px; /* Change size */
      width: 4px;
      margin-top: 0 !important;
      // top: -10%;
  }

  .v-slider {
  
    .v-slider.v-input--horizontal {
      grid-template-rows: auto 0px;
    }
    
    .v-slider.v-input--horizontal .v-slider-thumb__label {
      // top: calc(var(--v-slider-thumb-size) * 1.5);
      z-index:2000;
    }
    
    .v-slider.v-input--horizontal .v-slider-thumb__label::before {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-top: 6px solid currentColor;
        bottom: -15px;
    }
  }
}

#opacity-slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-left: 7%;
  padding-right: 7%;
  gap: 2px;

  .v-slider {
    margin-right: 0;
    width: 100%;
  }

  #opacity-slider-label {
    opacity: 0.7;
    width: fit-content;
  }
}

#body-logos {
  margin-bottom: -1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  img {
    height: 35px !important;
    vertical-align: middle;
    margin: 2px;
  }
}

#icons-container > a[href="https://worldwidetelescope.org/home/"] {
  display: none;
}

.v-selection-control {
  // height: fit-content;
}

.v-radio-group .v-input__details {
  display: none;
}

.v-radio-group .v-selection-control {
  label {
    width: 100%;
  }
}

.rounded-icon-wrapper{
  height: fit-content;
  align-self: center;
  padding-inline: 0.5rem;
  margin-left: 0.75rem;
  width: 2.5rem;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  border-radius: 20px;
}

i.mdi-menu-down {
  color: var(--smithsonian-blue);
}

// From Sara Soueidan (https://www.sarasoueidan.com/blog/focus-indicators/) & Erik Kroes (https://www.erikkroes.nl/blog/the-universal-focus-state/)
:focus-visible:not(.v-field__input input),
button:focus-visible,
.focus-visible,
.v-selection-control--focus-visible .v-selection-control__input {
  outline: 9px double white !important;
  box-shadow: 0 0 0 6px black !important;
  border-radius: .125rem;
}

.controls-card {
  padding: 1rem;
  border: 1px solid #068ede;
}

//  mobile styles

// ========= DEFINE MOBILE STYLES =========
// KEEP THEM ALL HERE
@media (max-width: 1180px) {
  
  .content-with-sidebars {
    grid-template-columns: 0px auto auto;
    grid-template-rows: 3.5rem var(--map-height) 78px .5fr .5fr;
    
    #when {
      display: none;
    }
    
    #where {
      display: none;
    }
    
    #title {
      text-wrap: wrap;
      font-size: 2rem;
      line-height: 1.25;
      margin-left: 10px;
    }
    
    #slider-row {
      margin-left: 3rem;
    }
    
    a[href="https://tempo.si.edu"] > img {
      height: 70px!important;
      width: auto !important;
    }
    
    #user-options {
      width: 250px;
    }
  
  
  }
}

@media (max-width: 750px) {
  :root {
    --map-height: 60vh;
    --map-height: 60dvh;
    --map-height: 60svh;
    font-size: 14px;
  }
  
  #main-content {
    padding: 1rem;
  }
  
  #introduction-overlay .v-window {
    max-height: 75vh;
    max-height: 75dvh;
    max-height: 75sdvh;
    overflow-y: scroll;
  }
  
  #introduction-overlay .intro-text {
    font-size: 1.15em;
  }
  
  #introduction-overlay ul li {
    margin-block-start: 1.15em;
  }
  .content-with-sidebars {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 78px repeat(5, auto);
    gap: 10px;
    // padding-inline: 1rem;
    
    
    #logo-title {
      min-width: 0;
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    
    a[href="https://tempo.si.edu"]:has(img) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    
    #map-container {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
    
    #map-container #map-show-hide-controls {
      right: 5px
    }
    
    #slider-row {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
    
    #user-options {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
    }
    
    
    #where {
      display: none;
    }
    
    
    #when {
      display: none;
    }
    
    
    #bottom-options {
      grid-column: 1 / 2;
      grid-row: 5 / 6;
    }
    
    #information {
      grid-column: 1 / 2;
      grid-row: 6 / 7;
    }
    
    // #body-logos {
    //   grid-column: 1 / 2;
    //   grid-row: 7 / 8;
    // }
  }
  
  .content-with-sidebars {
    
    #slider-row {
      margin-left: 4rem;
      margin-right: 1rem;
      padding-top: 10px;
      align-items: center;
    }
    
    #user-options {
      margin: 0;
      width: auto;
    }
    
    #bottom-options {
      margin: 0;
    }
    
    #information {
      font-size: 1em;
    }
    
  
  
  #title {
    font-size: 2rem;
    margin-left: 15px;
    text-wrap: wrap;

  }
  
}
  
  
  #map-container {
    display: flex;
    flex-direction: column;
    
    
    #map-contents {
      position: relative;
    }
    
    #map-legend {
      right: 0;
    }
    
    .colorbar-container-horizontal {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      z-index: 5000;
      --height: 0.75rem;
    }
    
  }


}

/* Leaflet crispness override */
// @JobLeonard - https://github.com/Leaflet/Leaflet/issues/5883#issue-269071844
// .leaflet-container .leaflet-overlay-pane svg,
// .leaflet-container .leaflet-marker-pane img,
// .leaflet-container .leaflet-shadow-pane img,
// .leaflet-container .leaflet-tile-pane img,
.leaflet-container img.leaflet-image-layer {
  max-width: none !important;
  /* Preserve crisp pixels with scaled up images */
  image-rendering: optimizeSpeed;             /* Legal fallback */
  image-rendering: -moz-crisp-edges;          /* Firefox        */
  image-rendering: -o-crisp-edges;            /* Opera          */
  image-rendering: -webkit-optimize-contrast; /* Safari         */
  image-rendering: optimize-contrast;         /* CSS3 Proposed  */
  image-rendering: crisp-edges;               /* CSS4 Proposed  */
  image-rendering: pixelated;                 /* CSS4 Proposed  */
  -ms-interpolation-mode: nearest-neighbor;   /* IE8+           */
}
#search-error {
  position: absolute;
  z-index: 9999;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
}

canvas.maplibregl-canvas {
  background-color: whitesmoke;
}

</style>
