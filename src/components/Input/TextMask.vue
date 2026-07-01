<template>
  <div class="grid gap-1">
    <label v-if="label != null" :pattern="pattern" :for="name" class="text-xs md:text-sm text-text-500 font-medium" :class="customLabelClass"> 
      {{ label }}<span v-if="required" class="text-red-600">*</span> 
    </label>

    <div class="relative group">
      <i class="absolute left-3 translate-y-1/2" :class="`${icon} ${modelValue ? 'text-primary-500' : 'text-text-300'}`"></i>
      <input :pattern="pattern" :required="required" 
        :minlength="minlength" :maxlength="maxlength" :max="max" :min="min" 
        :disabled="disabled" :type="type" :name="name" :id="name" :placeholder="placeholder" v-mask="mask"
        @invalid="error = true; $refs.inputElement.setCustomValidity(!modelValue ? 'Input tidak boleh kosong!' : validation)" 
        v-model="value" @keyup="$emit('keyup', $event.target.value)" @keypress="handleKeypress" @paste="handlePaste"
        class="input-text-default" ref="inputElement"
        :class="[
          customInputClass, 
          icon != '' ? 'pl-[35px] pr-3' : 'px-3', 
          error ? 'border-red-500 bg-red-50/50' : '',
          disabled ? ' bg-gray-100 text-gray-500' : 'focus:outline-primary-500 focus:bg-primary-50 ',
        ]"
      />
      <div v-if="error && this.helperStore.form_error.some(res => res?.item_name == this.name)" class="hidden group-hover:block absolute top-full w-fit h-fit z-20">
        <div class="bg-[#FEDFDD] w-[15px] h-[15px] rotate-45 mb-[-8px] mt-1 ml-5"></div>
        <div class="grid gap-1 bg-[#FEDFDD] rounded-xl p-2">
          <p class="flex gap-1 items-center text-[10px] text-[#FB6056]"> <i class="ri-error-warning-fill text-sm"></i> {{ this.helperStore.form_error.find(res => res?.item_name == this.name)?.message }}</p>
        </div>
      </div>
    </div>
    <p class="font-bold leading-none text-[9px] text-primary-500" v-if="description"> {{ description ?? '' }} </p>
  </div>

</template>
<script>
import { useHelperStore } from '@/stores/helper.store.js'

export default {
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
    description: {
      type: String,
      default: null
    },
    title_desc: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'title'
    },
    mask: {
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
      default: 256
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
  emits: ['update:modelValue', 'keyup'],
  data() {
    return {
      helperStore: useHelperStore(),
      error: false
    }
  },
  methods:{
    handleKeypress(e){
      if (/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
      }
    },
    handlePaste(e) {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      // Remove all letters
      const filtered = pastedText.replace(/[a-zA-Z]/g, '');
      
      // Insert at cursor position
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      this.value = this.value.substring(0, start) + 
                   filtered + 
                   this.value.substring(end);
    }
  },
  computed: {
    customLabelClass() {
      return this.labelClass
    },
    customInputClass() {
      return this.inputClass
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
  }
}
</script>

<style scoped>
.input-text-default {
  @apply appearance-none w-full rounded-lg border border-border-400 py-2 text-sm;
}
</style>