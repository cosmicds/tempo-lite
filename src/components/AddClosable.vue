<script setup lang="ts">
import { ref, useAttrs } from 'vue';
// import type { VBtn } from 'vuetify/components';
// type VBtnProps = VBtn["$props"];
// defineProps<VBtnProps>();

interface PropsType {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  translateX?: string;
  translateY?: string;
  tooltip?: string;
}

const props = defineProps<PropsType>();

const cssVars = {
  '--top': props.top ?? '0',
  '--right': props.right ?? '0',
  '--bottom': props.bottom ?? 'unset',
  '--left': props.left ?? 'unset',
  '--translatex': props.translateX ?? '70%',
  '--translatey': props.translateY ?? '-50%',
};


const isVisible = ref(true);
// https://vuejs.org/guide/components/attrs
const attrs = useAttrs(); // fallthrough attributes.
</script>

<template>
  <div v-if="isVisible" class="closable-wrapper">
      <slot></slot>
      <v-tooltip
          :disabled="tooltip==='' || tooltip===undefined || tooltip===null"
          :text="tooltip"
          open-on-focus
          open-on-hover
        >
        <template #activator="{ props }">
          <v-btn v-bind="{...attrs, ...props}" icon="mdi-close" class="closable-close-btn" density="compact" @click="isVisible = false"  :style="cssVars"/>
        </template>
      </v-tooltip>
  </div>
</template>

<style scoped>
.closable-wrapper
{ 
  display: inline-flex;
  align-content: center;
  position: relative;
  width: fit-content;
  height: fit-content;
  overflow: visible;
  margin: 0;
  padding: 0;
  
}

.closable-close-btn
{
  position: absolute;
  top: var(--top);
  left: var(--left);
  right: var(--right);
  transform: translateX(var(--translatex)) translateY(var(--translatey));
  z-index: 1;
}
</style>
