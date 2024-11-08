import Vue, { createApp } from "vue";

import { FundingAcknowledgement, IconButton, CreditLogos } from "@cosmicds/vue-toolkit";
import LocationSearch from "./LocationSearch.vue";
import TempoLite from "./TempoLite.vue";
import Colorbar from './ColorBar.vue';
import ColorBarHorizontal from "./ColorBarHorizontal.vue";
import InfoButton from "./InfoButton.vue";
import vuetify from "../plugins/vuetify";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { FocusTrap } from "focus-trap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBookOpen,
  faPlay,
  faPause,
  faTimes,
  faVideo,
  faMagnifyingGlass,
  faCircleXmark,
  faSquareXmark,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import VueDatePicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css';

library.add(faBookOpen);
library.add(faPlay);
library.add(faPause);
library.add(faTimes);
library.add(faVideo);
library.add(faMagnifyingGlass);
library.add(faCircleXmark);
library.add(faSquareXmark);
library.add(faHome);


/** v-hide directive taken from https://www.ryansouthgate.com/2020/01/30/vue-js-v-hide-element-whilst-keeping-occupied-space/ */
// Extract the function out, up here, so I'm not writing it twice
const update = (el: HTMLElement, binding: Vue.DirectiveBinding) => el.style.visibility = (binding.value) ? "hidden" : "";

createApp(TempoLite, {})
 
  // Plugins
  .use(vuetify)

  // Directives
  .directive(
    /**
    * Hides an HTML element, keeping the space it would have used if it were visible (css: Visibility)
    */
    "hide", {
      // Run on initialisation (first render) of the directive on the element
      beforeMount(el, binding, _vnode, _prevVnode) {
        update(el, binding);
      },
      // Run on subsequent updates to the value supplied to the directive
      updated(el, binding, _vnode, _prevVnode) {
        update(el, binding);
      }
    })

  // Components
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('icon-button', IconButton)
  .component('funding-acknowledgement', FundingAcknowledgement)
  .component('credit-logos', CreditLogos)
  .component('colorbar', Colorbar)
  .component('location-search', LocationSearch)
  .component('info-button', InfoButton)
  .component('colorbar-horizontal', ColorBarHorizontal)
  .component('date-picker', VueDatePicker)
  .component('focus-trap', FocusTrap)

  // Mount
  .mount("#app");
