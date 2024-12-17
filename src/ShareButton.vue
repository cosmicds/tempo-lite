
<template>
  <use-clipboard v-slot="{ copy, copied }" :source="source">
    <v-tooltip :text="copied ? 'Link Copied' : 'Copy link to share view'">
      <template v-slot:activator="{ props }">
        <v-btn
          aria-label="Copy link to share view"
          class="share-button"
          icon
          @click="copy()"
          @keyup.enter="copy()"
          v-bind="props"
          :color="buttonColor"
          :elevation="elevation"
          :size="size"
          :rounded="rounded"
        >
          <v-icon :color="iconColor">mdi-share-variant</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </use-clipboard>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    source: {
      type: String,
      required: true,
    },
    buttonColor: {
      type: String,
      default: "#ffffff66",
    },
    iconColor: {
      type: String,
      default: "#333",
    },
    elevation: {
      type: [String, Number],
      default: "0",
    },
    size: {
      type: String,
      default: "small",
    },
    rounded: {
      type: [String, Number],
      default: "1",
    },
    
  },
});
</script>

<style scoped>
.share-button {
  z-index: 1000;
  background-color: rgb(255 255 255);
  border: 1px solid black;
  backdrop-filter: blur(5px);
  padding-inline: 5px;
  border-radius: 10px;
}
</style>