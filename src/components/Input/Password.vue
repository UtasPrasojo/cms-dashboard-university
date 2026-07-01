<template>
  <div class="relative grid gap-1">
    <label v-if="label != null" :for="name" class="text-xs md:text-sm"> {{ label }}<span v-if="required" class="text-error-600">*</span> </label>
    <div class="relative">
      <i class="absolute left-3 top-2" :class="`${icon} ${modelValue ? 'text-primary-500' : 'text-text-300'}`" v-if="icon"></i>
      <input :type="showPassword ? 'password' : 'text'" :required="required" :maxlength="maxlength"
      :autocomplete="autocomplete"
        class="input-password-default" 
        :class="[
          icon != null? 'pl-[35px]' : 'px-3',
          error ? 'border-red-500 bg-red-50/50' : 'border-border-300 bg-transparent'
        ]" type="text" :name="name" :id="name" :placeholder="placeholder" v-model="value">
      <div class="cursor-pointer absolute right-3 top-2 text-text-300" @click="showPassword = !showPassword">
        <i class="" :class="!showPassword ? 'ri-eye-line':'ri-eye-off-line'"></i>
      </div>
    </div>
  </div>

</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useHelperStore } from '@/stores/helper.store.js'

const showPassword = ref(true);

const helperStore = useHelperStore()
const error = ref(false)

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: 'title'
  },
  maxlength: {
    type: Number,
    default: 30
  },
  label: {
    type: String,
    default: 'title'
  },
  placeholder: {
    type: String,
    default: 'title'
  },
  icon: {
    type: String,
    default: 'ri-lock-line'
  },
  required: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'password'
  }
});
watch(() => helperStore.form_error, () => {
  error.value = helperStore.form_error.some(res => res?.item_name == props.name)
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});
</script>
<style scoped>
.input-password-default {
  @apply w-full  rounded-lg border py-2 text-xs md:text-sm focus:outline-primary-500 focus:bg-primary-50
}
</style>