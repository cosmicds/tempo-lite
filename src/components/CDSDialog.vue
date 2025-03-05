<template>
  <v-dialog 
    :class="`cds-dialog ${shortTitleComputed.toLowerCase().replace(/ /g, '-')}-cds-dialog`" 
    v-model="showDialog" 
    >
    <!-- add the activator slot, but only use it if the appropriate value is given for activator -->
     <template v-slot:activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>
     
    <v-card class="cds-dialog-card">
      <font-awesome-icon 
        class="cds-dialog-close-icon cds-touch-pad"
        icon="square-xmark" 
        size="xl" 
        @click="showDialog = false" 
        @keyup.enter="showDialog = false"
        :color="color" 
        tabindex="0"
        ></font-awesome-icon>
        
      <v-card-title tabindex="0">
        <h3> 
          {{title}} 
        </h3>
      </v-card-title>
      
      <v-card-text>
        
        <slot>
          Add content to the default slot
        </slot>
        
      </v-card-text>
    </v-card>
  </v-dialog>

</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "CDSDialog",
  // any undeclared props are passed through to the v-dialog
  props: {
    title: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "red",
    },
    shortTitle: {
      type: String,
      required: false,
      default: "",
    },
  },
  
  data() {
    return {
      showDialog: this.modelValue,
    };
  },
  
  computed: {
    shortTitleComputed() {
      return this.shortTitle || this.title;
    }
  },
  
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.showDialog = val;
      }
    },
    showDialog: {
      immediate: true,
      handler(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },
  
});
</script>

<style>

.cds-dialog {
  display: flex;
  width: calc(100% - 1rem);
}
.cds-dialog-card {
  align-self: center;
  max-width: 80%;
}

.cds-dialog-close-icon {
  position: absolute;
  right: 16px;
  cursor: pointer;
}

/* pad the touch area by 0.5em */
.cds-dialog-touch-pad {
  padding: 0.5em;
  margin: -0.5em;
}


.v-dialog.cds-dialog > .v-overlay__content > .v-card {
  padding: 1rem;
}

.v-dialog.cds-dialog > .v-overlay__content {
  align-self: center;
  margin: unset;
}

.cds-dialog .v-card-text {
  height: 40vh;
}
</style>