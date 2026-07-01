<template>
  <div v-bind="wrapperAttrs" :class="['grid', label ? 'gap-1': '']">
    <label v-if="label != null" :pattern="pattern" :for="name" class="text-xs md:text-sm text-text-500 font-medium w-fit  " :class="customLabelClass"> 
      {{ label }}<span v-if="required" class="text-error-600">*</span> 
    </label>
    <label class="flex items-center  gap-2 py-2 px-3 w-full  border rounded-md focus:border-primary-500" :for="name">
      <div class="relative w-6 h-[18px] rounded-md flex-none border overflow-hidden">
        <input type="color" class="absolute -top-2 -left-1 h-14 w-14" :name="name" :id="name" id="" v-model="value" :required="required" :disabled="disabled">
      </div>
      <p class="flex-1 text-sm"> {{ value }} </p>
      <i class="fi fi-rr-angle-small-down leading-3"></i>
    </label>
  </div>
</template>
<script>
import { useHelperStore } from '@/stores/helper.store.js'

export default {
  inheritAttrs: false,
  props: {
    modelValue: {
      default: null
    },
    labelClass: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'title'
    },
    label: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'title'
    },
    icon: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minlength: {
      type: Number,
      default: 0
    },
    maxlength: {
      type: Number,
      default: 200
    },
    max: {
      type: [String, Number],
      default: null
    },
    min: {
      type: [String, Number],
      default: null
    },
    validation: {
      type: String,
      default:'Format input tidak sesuai!'
    },
    pattern: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      helperStore: useHelperStore(),
      error: false
    }
  },
  computed: {
    customLabelClass() {
      return this.labelClass
    },
    customInputClass() {
      return this.inputClass
    },
    // attrs ke wrapper (class, style, dll)
    wrapperAttrs() {
      const res = {}
      for (const key in this.$attrs) {
        // semua yg BUKAN event (onX) masuk ke wrapper
        if (!(key.startsWith('on') && key !== 'onUpdate:modelValue')) {
          res[key] = this.$attrs[key]
        }
      }
      return res
    },
    // attrs ke input (semua event: @focus, @keyup, dsb)
    inputAttrs() {
      const res = {}
      for (const key in this.$attrs) {
        if (key.startsWith('on') && key !== 'onUpdate:modelValue') {
          res[key] = this.$attrs[key]
        }
      }
      return res
    },
    value:{
      get() {
        this.error = false
        this.$nextTick(() => {
        })        
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    'helperStore.form_error' : {
      handler() {
        this.error = this.helperStore.form_error.some(res => res?.item_name == this.name)
      },
      immediate: false,
      deep: true
    }
  },
  unmounted() {
    this.helperStore.form_error = []
  }
}
</script>

<style scoped>
.input-text {
  @apply appearance-none w-full rounded-lg border border-border-400 py-2 text-sm;
}
.input-text:disabled {
  @apply bg-gray-100 text-gray-500
}
.input-text:focus {
  @apply outline-primary-500 bg-primary-100
}
</style>