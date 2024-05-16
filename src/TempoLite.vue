<template>
<v-app
  id="app"
  :style="cssVars"
>
  <div
    id="main-content"
  >
    
    <div class="content-with-sidebars">
      <!-- tempo logo -->
      <a href="https://tempo.si.edu" target="_blank" rel="noopener noreferrer" >
        <img 
        src="./assets/TEMPO-Logo-Small.png"
        alt="TEMPO Logo"
        style="width: 100px; height: 100px;"
      >
      </a>

      <h1 id="title">How much NO<sub>2</sub>&hellip;</h1>
      <div id="where" class="big-label">where</div>
      <div id="map-container">
        <div id="map"></div>
        <div v-if="showFieldOfRegard" id="map-legend"><hr class="line-legend">TEMPO Field of Regard</div>
        <colorbar 
          label="Amount of NO2"
          backgroundColor="transparent"
          :nsteps="255"
          :cmap="cbarNO2"
          start-value="1"
          end-value="150"
          :extend="true"
          >
          <template v-slot:label>
              <div style="text-align: center;">Amount of NO&#x2082;<br><span class="unit-label">(10&sup1;&#x2074; molecules/cm&sup2;)</span></div>
          </template>
        </colorbar>
        <location-search
          v-model="searchOpen"
          small
          stay-open
          buttonSize="xl"
          persist-selected
          :search-provider="geocodingInfoForSearch"
          @set-location="(feature: MapBoxFeature) => {
            if (feature !== null) {
              map?.setView([feature.center[1], feature.center[0]], 6);
            }
          }"
          @error="(error: string) => searchErrorMessage = error"
        ></location-search>
      </div>
        <div id="when" class="big-label">when</div>
        <div id="slider-row">
          <v-slider
            v-model="timeIndex"
            :min="minIndex"
            :max="maxIndex"
            :step="1"
            color="#068ede95"
            thumb-label="always"
            :track-size="10"
            hide-details
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


        <div id="timezone-select">
          <v-select
            v-model="selectedTimezone"
            label="Timezone"
            :items="timezoneOptions"
            item-title="name"
            item-value="tz"
          ></v-select>
        </div>

       <div id="user-options">
         <div id="date-radio">
           <!-- make a v-radio-group with 3 options -->
          <h2>Featured Dates</h2>
          <v-radio-group
            v-model="radio"
            row
          >
            <v-radio
              label="November 1, 2023"
              :value="0"
            ></v-radio>
            <v-radio
              label="November 3, 2023"
              :value="1"
            ></v-radio>
            <v-radio
              label="March 28, 2024"
              :value="2"
            ></v-radio>
          </v-radio-group>
        </div>

        <hr style="border-color: grey;">
        
        <div id="locations-of-interest">
          <h3 class="mb-1">Locations for {{ radio==0 ? 'Nov 1' : radio==1 ? 'Nov 3' : 'Mar 28' }}</h3>
          <v-radio-group
            v-model="sublocationRadio"
            row
          >
            <v-radio
              v-for="(loi, index) in locationsOfInterest[radio]"
              v-bind:key="index"
              :label="loi.text"
              :value="index"
            ></v-radio>
          </v-radio-group>
        </div>

        <hr style="border-color: grey;">

        <div id="control-checkboxes">
          <v-checkbox
            v-model="showFieldOfRegard"
            @keyup.enter="showFieldOfRegard = !showFieldOfRegard"
            label="TEMPO Field of Regard"
            color="#c10124"
            hide-details
          />       
        </div>
      </div>
  
      <div id="information">
      <article>
        <h2>TEMPO NO<sub>2</sub> Data</h2>
        <p>
          TEMPO, a collaboration between the Smithsonian and NASA, is the first space-based probe to measure air pollution hourly over North America at neighborhood scales. NO<sub>2</sub> (nitrogen dioxide) is one of the pollutants detected by TEMPO. It is produced by wildfires and the burning of fossil fuels. NO<sub>2</sub> contributes to the formation of harmful ground-level ozone and toxic particulates in the air we breathe.
        </p>
        <p>
          <a id="credits-link">
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
                    Caroline Nowlan, Aaron Naeger, and Erika Wright provided dates and locations for events of interest in the TEMPO data.
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

                  <funding-acknowledgment class="my-3"></funding-acknowledgment>
                </v-card-text>
              </v-card>
            </v-dialog>
          </a>
        </p>
      </article>
      </div>
      <div id="body-logos">
        <a href="https://www.si.edu/" target="_blank" rel="noopener noreferrer" class="mr-1" 
        ><img alt="Smithsonian Logo" src="./assets/smithsonian.png"
         /></a>
        <credit-logos/>
      </div>
    </div>

    

    <!-- This contains the splash screen content -->

    <v-overlay
      :model-value="showSplashScreen"
      absolute
      opacity="0.6"
      :style="cssVars"
      id="splash-overlay"
    >
      <div
        id="splash-screen"
        v-click-outside="closeSplashScreen"
        :style="cssVars"
      >
        <div
          id="close-splash-button"
          @click="closeSplashScreen"
          >&times;
        </div>
        <div id="splash-screen-text">
          <p>Splash Screen Content</p>
        </div>
        <div id="splash-screen-acknowledgements" class="small">
          This Data Story is brought to you by <a href="https://www.cosmicds.cfa.harvard.edu/" target="_blank" rel="noopener noreferrer">Cosmic Data Stories</a> and <a href="https://www.worldwidetelescope.org/home/" target="_blank" rel="noopener noreferrer">WorldWide Telescope</a>.
          
          <div id="splash-screen-logos">
            <credit-logos logo-size="5vmin"/>
          </div>
        </div>
      </div>
    </v-overlay>

  </div>
</v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import L, { Map } from "leaflet";
import "leaflet.zoomhome";
import { getTimezoneOffset } from "date-fns-tz";
import  { cividis } from "./cividis";
import  { svs } from "./svs_cmap";
import { cbarNO2, cbarNO2ColorsRevised2023 } from "./revised_cmap";
import fieldOfRegard from "./assets/TEMPO_FOR.json";
// We DO use MapBoxFeature in the template, but eslint isn't picking this up for some reason
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MapBoxFeature, MapBoxFeatureCollection, geocodingInfoForSearch } from "./mapbox";


type SheetType = "text" | "video" | null;
type Timeout = ReturnType<typeof setTimeout>;

interface TimezoneInfo {
  tz: string;
  name: string;
}

import earthdataTimestamps from "./timestamps";

const fosterTimestamps = [
  1698838920000,
  1698841320000,
  1698843720000,
  1698846120000,
  1698848520000,
  1698852120000,
  1698855720000,
  1698859320000,
  1698862920000,
  1698866520000,
  1698870120000,
  1698873720000,
  1698876120000,
  1698878520000,
  1698880920000,
  1699011720000,
  1699014120000,
  1699016520000,
  1699018920000,
  1699021320000,
  1699024920000,
  1699028520000,
  1699032120000,
  1699035720000,
  1699039320000,
  1699042920000,
  1699046520000,
  1699048920000,
  1699051320000,
  1699053720000,
  1711626180000,
  1711628640000,
  1711631040000,
  1711633440000,
  1711637040000,
  1711640640000,
  1711644240000,
  1711647840000,
  1711651440000,
  1711655040000,
  1711658640000,
  1711662240000,
  1711665840000,
  1711668240000,
];

// combine the timestamps from the two sources
const timestamps = earthdataTimestamps.concat(fosterTimestamps);
// sort the timestamps
timestamps.sort();


interface LocationOfInterest {
  latlng: L.LatLngExpression;
  zoom: number;
  text: string;
  index: number;
}

export default defineComponent({
  data() {
    const showSplashScreen = new URLSearchParams(window.location.search).get("splash")?.toLowerCase() !== "false";
    const novDecBounds = new L.LatLngBounds(
      new L.LatLng(17.025, -154.975),
      new L.LatLng(63.975, -24.475)
    );

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

    const locationsOfInterest = [
      [{ latlng: [34.359786, -111.700124], zoom:7, text: "Arizona Urban Traffic + Wildfires", index: 4}, { latlng: [36.1716, -115.1391], zoom:7, text: "Las Vegas: Fairly Constant Levels All Day", index: 4}],  // Nov 1
      [{ latlng: [36.215934, -119.777500], zoom:6, text: "California Traffic + Wildfires (SE of Sacramento)", index: 19}, { latlng: [41.857260, -80.531177], zoom:5, text: "Northeast: Large Emissions Plumes", index: 16}],  // Nov 3
      [{ latlng: [31.938392, -99.095785], zoom:6, text: "Texas Urban + Transport Pollution; Wildfires in NE", index: 32}, { latlng: [31.331933, -91.575283], zoom: 8, text: "LA/MS Wildfires", index: 36}],  // Mar 28
    ] as LocationOfInterest[][];

    return {
      showSplashScreen,
      sheet: null as SheetType,
      layersLoaded: false,
      positionSet: false,
      
      accentColor: "#068ede",
      accentColor2: "#ffd302",
      buttonColor: "#ffffff",

      radio: 0,
      sublocationRadio: null as number | null,

      touchscreen: false,
      playInterval: null as Timeout | null,
      map: null as Map | null,
      basemap: null as L.TileLayer.WMS | null,
      novDecBounds,
      marchBounds: new L.LatLngBounds(
        new L.LatLng(14.01, -167.99),
        new L.LatLng(72.99, -13.01)
      ),
      fieldOfRegardLayer,
      locationsOfInterest,

      timezoneOptions: [
        { tz: 'US/Eastern', name: 'Eastern Daylight' },
        { tz: 'US/Central', name: 'Central Daylight' },
        { tz: 'US/Mountain', name: 'Mountain Daylight' },
        { tz: 'US/Arizona', name: 'Mountain Standard' },
        { tz: 'US/Pacific', name: 'Pacific Daylight' },
        { tz: 'US/Alaska', name: 'Alaska Daylight' },
        { tz: 'UTC', name: 'UTC' },
      ] as TimezoneInfo[],
      selectedTimezone: "US/Eastern",

      timestep: 0,
      timeIndex: 0,
      minIndex: 0,
      maxIndex: timestamps.length - 1,
      timeValues: [...Array(timestamps.length).keys()],
      playing: false,
      imageOverlay: new L.ImageOverlay("", novDecBounds, {
        opacity: 1,
        interactive: false,
      }),
      timestamps,
      earthdataTimestamps,
      fosterTimestamps,

      searchOpen: true,
      searchErrorMessage: null as string | null,

      showControls: true,
      showFieldOfRegard: true,
      showCredits: false,
    };
  },

  created() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.touchscreen = ('ontouchstart' in window) || ('ontouchstart' in document.documentElement) || !!window.navigator.msPointerEnabled;
  },

  mounted() {
    this.showSplashScreen = false;
    this.map = L.map("map", { zoomControl: false }).setView([40.044, -98.789], 4, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      crs: L.CRS.EPSG4326
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const zoomHome = L.Control.zoomHome();
    const originalZH = zoomHome._zoomHome.bind(zoomHome);
    zoomHome._zoomHome = (_e: Event) => {
      originalZH();
      this.sublocationRadio = null;
    };
    zoomHome.addTo(this.map);
    this.addCoastlines();

    this.basemap = new L.TileLayer.WMS('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      crs: L.CRS.EPSG4326
    }).addTo(this.map as Map);

    const labelPane = this.map.createPane("labels");
    labelPane.style.zIndex = "650";
    labelPane.style.pointerEvents = "none";

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap, CartoDB',
      pane: 'labels'
    }).addTo(this.map as Map);

    this.imageOverlay.setUrl(this.imageUrl).addTo(this.map as Map);
    
    if (this.showFieldOfRegard) {
      this.fieldOfRegardLayer.addTo(this.map as Map);
    }
  },

  computed: {

    /**
    Properties related to device/screen characteristics
    */
    smallSize(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    mobile(): boolean {
      return this.smallSize && this.touchscreen;
    },

    /**
    This lets us inject component data into element CSS
    */
    cssVars() {
      return {
        '--accent-color': this.accentColor,
        '--accent-color-2': this.accentColor2,
        '--app-content-height': this.showTextSheet ? '66%' : '100%',
      };
    },

    /**
    Computed flags that control whether the relevant dialogs display.
    The `sheet` data member stores which sheet is open, so these are just
    computed wrappers around modifying/querying that which can be used as
    dialog v-model values
    */
    showTextSheet: {
      get(): boolean {
        return this.sheet === 'text';
      },
      set(_value: boolean) {
        this.selectSheet('text');
      }
    },
    showVideoSheet: {
      get(): boolean {
        return this.sheet === "video";
      },
      set(value: boolean) {
        this.selectSheet('video');
        if (!value) {
          const video = document.querySelector("#info-video") as HTMLVideoElement;
          video.pause();
        }
      }
    },
    timestamp(): number {
      return this.timestamps[this.timeIndex];
    },
    date() {
      return new Date(this.timestamp);
    },
    // TODO: Maybe there's a built-in Date function to get this formatting?
    thumbLabel(): string {
      const offset = getTimezoneOffset(this.selectedTimezone, this.date);
      const date = new Date(this.timestamp + offset); 
      const hours = date.getUTCHours();
      const amPm = hours >= 12 ? "PM" : "AM";
      let hourValue = hours % 12;
      if (hourValue === 0) {
        hourValue = 12;
      }
      return `${this.date.getUTCMonth()+1}/${date.getUTCDate()}/${date.getUTCFullYear()} ${hourValue}:${date.getUTCMinutes().toString().padStart(2, '0')} ${amPm}`;
    },
    imageUrl(): string {
      if (this.fosterTimestamps.includes(this.timestamp)) {
        return `https://tempo-demo-images.s3.amazonaws.com/tempo_${this.date.getUTCFullYear()}-${(this.date.getUTCMonth()+1).toString().padStart(2, '0')}-${this.date.getUTCDate().toString().padStart(2, '0')}T${this.date.getUTCHours()}h${this.date.getUTCMinutes().toString().padStart(2, '0')}m.png`;
      }
      
      if (this.earthdataTimestamps.includes(this.timestamp)) {
        const fname = `tempo_${this.date.getUTCFullYear()}-${(this.date.getUTCMonth()+1).toString().padStart(2, '0')}-${this.date.getUTCDate().toString().padStart(2, '0')}T${this.date.getUTCHours()}h${this.date.getUTCMinutes().toString().padStart(2, '0')}m.png`;
        const url = 'https://johnarban.github.io/wwt_interactives/images/tempo/';
        return url + fname;
      }
    
      return "";
    },
  },

  methods: {
    
    cividis(x: number): string {
      return cividis(x);
    },
    
    svs(x: number): string {
      return svs(x);
    },
    
    cbarNO2(x: number): string {
      const rgb = cbarNO2(0, 1, x);
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},1)`;
    },
    
    cbarNO2ColorsRevised2023(x: number): string {
      const rgb = cbarNO2ColorsRevised2023(0, 1, x);
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},1)`;
    },
    
    blurActiveElement() {
      const active = document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    },

    closeSplashScreen() {
      this.showSplashScreen = false; 
    },

    selectSheet(name: SheetType) {
      if (this.sheet === name) {
        this.sheet = null;
        this.$nextTick(() => {
          this.blurActiveElement();
        });
      } else {
        this.sheet = name;
      }
    },
    addCoastlines() {
      fetch("coastlines.geojson")
        .then(response => response.json())
        .then(data => {
          L.geoJson(data, {
            style: { color: "black", weight: 1, opacity: 0.8 }
          }).addTo(this.map as Map);
        });
    },
    async geocodingInfoForSearch(searchText: string): Promise<MapBoxFeatureCollection | null> {
      return geocodingInfoForSearch(searchText, { countries: ["US", "CA", "MX", "CU", "BM", "HT", "DO"] }).catch(_err => null);
    },
    resetMapBounds() {
      this.map?.setView([40.044, -98.789], 4);
    },
    play() {
      this.playInterval = setInterval(() => {
        if (this.timeIndex >= this.maxIndex) {
          if (this.playInterval) {
            // clearInterval(this.playInterval);
            // this.playInterval = null;
            // let it loop
            this.timeIndex = this.minIndex;
          }
        } else {
          this.timeIndex += 1;
        }
      }, 1000);
    },
    pause() {
      if (this.playInterval) {
        clearInterval(this.playInterval);
      }
    }
  },

  watch: {
    playing(play: boolean) {
      if (play) {
        this.play();
      } else {
        this.pause();
      }
    },
    imageUrl(url: string) {
      this.imageOverlay.setUrl(url);
    },
    showFieldOfRegard (show: boolean) {
      if (show) {
        this.fieldOfRegardLayer.addTo(this.map as Map);
      } else if (this.map) {
        this.map.removeLayer(this.fieldOfRegardLayer as L.Layer);
      }
    },
    radio(value: number) {
      const minIndex = 15 * value;
      // this.minIndex = minIndex;
      // this.maxIndex = Math.min(15 * (value + 1) - 1, this.timestamps.length - 1);
      this.minIndex = 0;
      this.maxIndex = this.timestamps.length - 1;
      this.timeIndex = minIndex;
      const bounds = value < 2 ? this.novDecBounds : this.marchBounds;
      this.imageOverlay.setBounds(bounds);
      this.sublocationRadio = null;
    },
    sublocationRadio(value: number | null) {
      if (value !== null) {
        const loi = this.locationsOfInterest[this.radio][value];
        this.map?.setView(loi.latlng, loi.zoom);
        this.timeIndex = loi.index;
      }
    }
  }
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
  --default-font-size: clamp(0.7rem, min(1.7vh, 1.7vw), 1.1rem);
  --default-line-height: clamp(1rem, min(2.2vh, 2.2vw), 1.6rem);
  --smithsonian-blue: #009ade;
  --smithsonian-yellow: #ffcc33;
  --info-background: #092088;
  --map-height: 500px;
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
  color: #068ede;
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
  font-size: 12pt;
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
  grid-template-columns: .08fr .8fr .3fr;
  grid-template-rows: 50px var(--map-height) 78px 1fr;
  gap: 20px 10px;
  
  > * {
    background-color: transparent;
  }
  
  > div {
    outline: 1px solid transparent;
  }
  
  #user-options {
    margin-left: 1.5rem;
    grid-column: 3 / 4;
    grid-row: 2 / 3;
  }
  
  #title {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
  
  #where {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  
  #map-container {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
  
  #when {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
  
  #slider-row {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  #timezone-select {
    margin-left: 1.5rem;
    grid-column: 3 / 4;
    grid-row: 3 / 4;
  }
  
  #information {
    padding: 1rem;
    grid-column: 2 / 3;
    grid-row: 4 / 5;
  }

  #body-logos { 
    grid-column: 3 / 4;
    grid-row: 4 / 5;
    align-self: end;
    justify-self: end;
  }
}

//  style the content 
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
  font-size: 40px;
  text-align: left;
  text-wrap: nowrap;
}

#information {
  background-color: var(--info-background);
  border-radius: 10px;
  padding-inline: 1rem;
  // margin-right: 200px;
}

#credits-link {
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
  display: grid;
}

#date-radio {
  padding-bottom: 0.5rem;
}

#locations-of-interest {
  border: 1px solid black;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  overflow-y: scroll;

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

#map-container {
  position: relative;
  display: flex;
  flex-direction: row;

  > #map {
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
  }
  
  > #map-legend {
    position: absolute;
    top: 0;
    right: 65px;
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

  > .colorbar-container {
    flex-grow: 0;
    flex-shrink: 1;

    .colorbar-label {
      transform: rotate(180deg) translate(-110%,-50%)
    }

    .unit-label {
      font-size: 11pt;
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

  .icon-wrapper {
    padding-inline: 0.5rem !important;
  }
}

#splash-overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#splash-screen {
  color: #FFFFFF;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-around;

  font-family: 'Highway Gothic Narrow', 'Roboto', sans-serif;
  font-size: min(8vw, 7vh);

  border-radius: 10%;
  border: min(1.2vw, 0.9vh) solid var(--accent-color);
  overflow: auto;
  padding-top: 4rem;
  padding-bottom: 1rem;

  @media (max-width: 699px) {
    max-height: 80vh;
    max-width: 90vw;
  }

  @media (min-width: 700px) {
    max-height: 85vh;
    max-width: min(70vw, 800px);
  }

  div {
    margin-inline: auto;
    text-align: center;
  }

  .small {
    font-size: var(--default-font-size);
    font-weight: bold;
  }

  #close-splash-button {
    position: absolute;
    top: 0.5rem;
    right: 1.75rem;
    text-align: end;
    color: var(--accent-color);
    font-size: min(8vw, 5vh);

    &:hover {
      cursor: pointer;
    }
  }
}

.video-wrapper {
  height: 100%;
  background: black;
  text-align: center;
  z-index: 1000;

  #video-close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 15;
    
    &:hover {
      cursor: pointer;
    }

    &:focus {
      color: white;
      border: 2px solid white;
    }
  }
}

video {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

#info-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  padding: 0px;
  z-index: 10;
}

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

#control-checkboxes {
  margin-top: 0.5em;
}

#body-logos {
  display: flex;
  flex-direction: row;
  img {
    height: 35px;
    vertical-align: middle;
    margin: 2px;
  }
}

#icons-container > a[href="https://worldwidetelescope.org/home/"] {
  display: none;
}

.v-radio-group .v-input__details {
  display: none;
}

</style>
