<template>
  <div v-bind="wrapperAttrs" :class="['grid', label ? 'gap-1' : '']">
    <label v-if="label != null" :pattern="pattern?? undefined" :for="name" class="text-xs md:text-sm text-text-500 font-medium"
      :class="customLabelClass">
      {{ label }}<span v-if="required" class="text-error-600">*</span>
    </label>

    <div class="relative group">
      <i v-if="!slots.icon && icon" class="absolute left-3 translate top-2"
        :class="`${icon} ${modelValue ? 'text-primary-500' : 'text-text-300'}`"></i>
      <span v-else-if="slots.icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 [&>svg]:w-full [&>svg]:h-full"
        :class="modelValue ? 'text-primary-500' : 'text-text-300'">
        <slot name="icon" />
      </span>
      <input v-bind="inputAttrs" :pattern="pattern ?? undefined" :required="required" :minlength="minlength"
        :maxlength="maxlength" :disabled="disabled" :type="type" :name="name" :max="max ?? undefined"
        :min="min ?? undefined" :id="name" :placeholder="placeholder" @click="onInputClick" @invalid="onInvalid"
        v-model="value" class="input-text" ref="inputElement" :class="[
          customInputClass,
          hasIcon ? 'pl-[35px] pr-3' : 'px-3',
          error ? '!outline-error-500 !border-error-500 !bg-error-100' : '',
          type === 'datetime-local' && !modelValue ? 'datetime-empty' : '',
        ]" />
      <span v-if="type === 'datetime-local' && !modelValue"
        class="datetime-placeholder absolute top-1/2 -translate-y-1/2 py-1 text-sm text-text-300 pointer-events-none truncate"
        :class="[
          hasIcon ? 'left-[35px] right-3' : 'left-3 right-3',
          error ? 'bg-error-100' : 'bg-base-white',
        ]">
        {{ placeholder }}
      </span>
      <div v-if="error && helperStore.form_error.some((res) => res?.item_name == name)"
        class="hidden group-hover:block absolute top-full w-fit h-fit z-20">
        <div class="bg-[#FEDFDD] w-[15px] h-[15px] rotate-45 mb-[-8px] mt-1 ml-5"></div>
        <div class="grid gap-1 bg-[#FEDFDD] rounded-xl p-2">
          <p class="flex gap-1 items-center text-[10px] text-[#FB6056]"
            v-for="item in helperStore.form_error.filter((res) => res?.item_name == name)" :key="item.message">
            <i class="ri-error-warning-fill text-sm"></i>
            {{ item.message }}
          </p>
        </div>
      </div>
    </div>
    <p class="font-bold leading-none text-[9px] text-primary-500" v-if="description">
      {{ description ?? '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useAttrs, useSlots, watch } from 'vue'
import { useHelperStore } from '@/stores/helper.store.js'

defineOptions({
  inheritAttrs: false,
})

defineSlots<{
  icon?(): any
}>()

interface Props {
  modelValue?: string | number | null
  labelClass?: string
  inputClass?: string
  name?: string
  label?: string | null
  description?: string | null
  placeholder?: string
  icon?: string
  required?: boolean
  type?: string
  disabled?: boolean
  minlength?: number
  maxlength?: number
  max?: string | number | null
  min?: string | number | null
  validation?: string
  pattern?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  labelClass: '',
  inputClass: '',
  name: 'title',
  label: null,
  description: null,
  placeholder: 'title',
  icon: '',
  required: false,
  type: 'text',
  disabled: false,
  minlength: 0,
  maxlength: 200,
  max: null,
  min: null,
  validation: 'Format input tidak sesuai!',
  pattern: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const helperStore = useHelperStore()
const attrs = useAttrs()
const slots = useSlots()

const error = ref(false)
const inputElement = ref<HTMLInputElement | null>(null)

const customLabelClass = computed(() => props.labelClass)
const customInputClass = computed(() => props.inputClass)
const hasIcon = computed(() => !!props.icon || !!slots.icon)

const wrapperAttrs = computed(() => {
  const res: Record<string, unknown> = {}
  for (const key in attrs) {
    if (!(key.startsWith('on') && key !== 'onUpdate:modelValue')) {
      res[key] = attrs[key]
    }
  }
  return res
})

const inputAttrs = computed(() => {
  const res: Record<string, unknown> = {}
  for (const key in attrs) {
    if (key.startsWith('on') && key !== 'onUpdate:modelValue') {
      res[key] = attrs[key]
    }
  }
  return res
})

const value = computed<string | number | null>({
  get() {
    error.value = false
    nextTick(() => {
      inputElement.value?.setCustomValidity('')
    })
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

function onInvalid() {
  error.value = true
  inputElement.value?.setCustomValidity(
    !props.modelValue ? 'Input tidak boleh kosong!' : props.validation
  )
}

function onInputClick() {
  if (props.type === 'datetime-local' || props.type === 'date' || props.type === 'time') {
    try {
      inputElement.value?.showPicker?.()
    } catch (e) {
      // no-op
    }
  }
}

watch(
  () => helperStore.form_error,
  () => {
    error.value = helperStore.form_error.some((res: any) => res?.item_name == props.name)
  },
  { deep: true }
)

onUnmounted(() => {
  helperStore.form_error = []
})
</script>

<style scoped>
.input-text {
  @apply w-full rounded-lg border bg-surface-primary border-border-400 py-2 text-sm;
}

.input-text:not([type='date']):not([type='time']) {
  @apply appearance-none;
}

.input-text[type='datetime-local'] {
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

.input-text:focus~.datetime-placeholder {
  display: none;
}

.input-text:disabled {
  @apply bg-base-white text-gray-500;
}

.input-text:focus {
  @apply outline-primary-500 bg-primary-100;
}
</style>