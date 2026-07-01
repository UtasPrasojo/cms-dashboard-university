<template>
  <div class="flex flex-row gap-2 items-center">
    <div class="flex flex-col" v-if="position === 'left'">
      <p v-if="label" class="text-xs font-SemiBold text-text-600">{{ label }}</p>
    </div>
    <label :for="id ? id : 'switch-'+label+'input'" class="inline-flex cursor-pointer" :class="disabled ? 'pointer-events-none opacity-40' : ''">
      <input
        :id="id ? id : 'switch-'+label+'input'"
        type="checkbox"
        :disabled="disabled"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
        class="sr-only peer"
      />
      <div
        class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-base-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-base-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-600">
      </div>
    </label>
    <div class="flex flex-col" v-if="position === 'right'">
      <p v-if="label" class="text-xs font-SemiBold text-text-600">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>

/**
 * @type {{
 * modelValue: boolean,
 * label: string|null
 * }}
 */
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'right',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    default: null,
  },
});
defineEmits(['update:modelValue']);
</script>