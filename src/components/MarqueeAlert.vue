<style>
.cds-marquee-alert
{
  position: static;
  top: 0;
  left: 0;
  /* width: 100vw; */
  padding-inline: 1rem;
  padding-block: 5px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  color: white;
  z-index: 9999;
}
.cds-marquee-alert--sticky
{
  position: sticky;
}

.cds-marquee-alert--fixed 
{
  position: fixed;
  /* Horizontaly center a position fixed element */
  width: 90%; /* width does not need to be set */
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  /* add top: 50% tp center vertically */
}

.cds-marquee-alert a {
  color: #fff3cd;
}

.cds-marquee-alert.success
{
  background-color: rgb(var(--v-theme-success));
}
.cds-marquee-alert.error
{
  background-color: rgb(var(--v-theme-error));
}
.cds-marquee-alert.warning
{
  background-color: rgb(var(--v-theme-warning));
}
.cds-marquee-alert.info
{
  background-color: rgb(var(--v-theme-info));
}
.cds-marquee-alert__content
{
  line-height: 1.5;
  flex-grow: 1;
}

.cds-marquee-alert__close-button
{
  padding: 5px;
}
</style>

<template>
  <v-fade-transition>
  <div v-show="isVisible" :class="['cds-marquee-alert', 'elevation-3', type, { 'cds-marquee-alert--sticky': sticky }, { 'cds-marquee-alert--fixed': fixed }]">
    <v-avatar variant="flat" :color="type" :icon="icon" />
    <div class="cds-marquee-alert__content">
      <slot>
        <span>{{ message }}</span>
      </slot>
    </div>
    <v-btn @click="close" class="cds-marquee-alert__close-button" aria-label="Close alert" variant="tonal">
      Close
    </v-btn>
  </div>
  </v-fade-transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type StatusType = 'success' | 'error' | 'warning' | 'info';
export default defineComponent({
  name: 'MarqueeAlert',

  props: {
    message: {
      type: String,
      default: 'hello'
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: true
    },
    timeout: {
      type: Number,
      required: false,
      default: null
    },
    icon: {
      type: String,
      default: 'mdi-exclamation-thick'
    },
    type: {
      type: String as PropType<StatusType>,
      default: 'success'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  
  mounted() {
    if (this.disabled) {
      this.isVisible = false;
      return;
    }
    
    this.addTimeout();
  },

  data() {
    return {
      isVisible: this.modelValue,
    };
  },

  methods: {
    close() {
      this.isVisible = false;
    },
    addTimeout() {
      if (this.timeout !== null) {
        setTimeout(() => {
          this.isVisible = false;
        }, this.timeout);
      }
    }
  },

  watch: {
    isVisible(value) {
      this.$emit('update:modelValue', value);
    },

    modelValue(value) {
      this.isVisible = value;
      if (value) {
        this.addTimeout();
      }
    }
  }


});
</script>
