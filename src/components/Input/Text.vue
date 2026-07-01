<template>
  <div v-bind="wrapperAttrs" :class="['grid', label ? 'gap-1': '']">
    <label v-if="label != null" :pattern="pattern" :for="name" class="text-xs md:text-sm text-text-500 font-medium" :class="customLabelClass"> 
      {{ label }}<span v-if="required" class="text-error-600">*</span> 
    </label>

    <div class="relative group">
      <i class="absolute left-3 translate top-2" :class="`${icon} ${modelValue ? 'text-primary-500' : 'text-text-300'}`"></i>
      <input
        v-bind="inputAttrs"
        :pattern="pattern"
        :required="required"
        :minlength="minlength"
        :maxlength="maxlength"
        :disabled="disabled"
        :type="type"
        :name="name"
        :max="max"
        :min="min"
        :id="name"
        :placeholder="placeholder"
        @click="onInputClick"
        @invalid="error = true; $refs.inputElement.setCustomValidity(!modelValue
          ? 'Input tidak boleh kosong!'
          : validation)"
        v-model="value"
        class="input-text"
        ref="inputElement"
        :class="[
          customInputClass,
          icon != '' ? 'pl-[35px] pr-3' : 'px-3',
          error ? '!outline-error-500 !border-error-500 !bg-error-100' : '',
          type === 'datetime-local' && !modelValue ? 'datetime-empty' : '',
        ]"
      />
      <span
        v-if="type === 'datetime-local' && !modelValue"
        class="datetime-placeholder absolute top-1/2 -translate-y-1/2 py-1 text-sm text-text-300 pointer-events-none truncate"
        :class="[
          icon != '' ? 'left-[35px] right-3' : 'left-3 right-3',
          error ? 'bg-error-100' : 'bg-base-white',
        ]"
      >
        {{ placeholder }}
      </span>
      <div v-if="error && this.helperStore.form_error.some(res => res?.item_name == this.name)" class="hidden group-hover:block absolute top-full w-fit h-fit z-20">
        <div class="bg-[#FEDFDD] w-[15px] h-[15px] rotate-45 mb-[-8px] mt-1 ml-5"></div>
        <div class="grid gap-1 bg-[#FEDFDD] rounded-xl p-2">
          <p class="flex gap-1 items-center text-[10px] text-[#FB6056]" v-for="item in this.helperStore.form_error.filter(res => res?.item_name == this.name)">  
            <i class="ri-error-warning-fill text-sm"></i> 
            {{ item.message }}
          </p>
        </div>
      </div>
    </div>
    <p class="font-bold leading-none text-[9px] text-primary-500" v-if="description"> {{ description ?? '' }} </p>
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
          this.$refs.inputElement?.setCustomValidity('')
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
  },
  methods: {
    onInputClick() {
      if (this.type === 'datetime-local' || this.type === 'date' || this.type === 'time') {
        try { this.$refs.inputElement?.showPicker?.() } catch (e) {}
      }
    }
  }
}
</script>

<style scoped>
.input-text {
  @apply w-full rounded-lg border bg-surface-primary border-border-400 py-2 text-sm;
}
.input-text:not([type="date"]):not([type="time"]) {
  @apply appearance-none;
}
.input-text[type="datetime-local"] {
  -webkit-appearance: none;
  appearance: none;
  min-height: 38px;
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.input-text.datetime-empty:not(:focus)::-webkit-datetime-edit,
.input-text.datetime-empty:not(:focus)::-webkit-date-and-time-value {
  color: transparent;
}
.input-text:focus ~ .datetime-placeholder {
  display: none;
}
.input-text:disabled {
  @apply bg-base-white text-gray-500
}
.input-text:focus {
  @apply outline-primary-500 bg-primary-100
}
</style>