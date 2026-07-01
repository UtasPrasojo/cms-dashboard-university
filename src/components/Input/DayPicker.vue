<template>
  <div class="grid gap-1">
    <label v-if="label" class="font-SemiBold text-xs text-text-500">
      {{ label }}<span v-if="required" class="text-red-600">*</span>
    </label>
    <div class="flex flex-row items-center gap-1 p-1 rounded-xl border border-border-300 bg-base-light w-fit">
    <input
      type="text"
      class="sr-only"
      :value="modelValue.length ? modelValue.join(',') : ''"
      :required="required"
      tabindex="-1"
      aria-hidden="true"
    />
    <button
      v-for="day in days"
      :key="day.value"
      type="button"
      @click="toggleDay(day.value)"
      class="px-3 py-1.5 rounded-lg text-xs font-Medium transition-colors min-w-[36px] text-center"
      :class="isSelected(day.value)
        ? 'bg-primary-400 text-base-white'
        : 'text-text-400 hover:bg-base-section'"
    >
      {{ day.label }}
    </button>
  </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const days = [
  { label: 'Sen', value: 1 },
  { label: 'Sel', value: 2 },
  { label: 'Rab', value: 3 },
  { label: 'Kam', value: 4 },
  { label: 'Jum', value: 5 },
  { label: 'Sab', value: 6 },
  { label: 'Min', value: 7 },
];

const isSelected = (value) => props.modelValue.includes(value);

const toggleDay = (value) => {
  const current = [...props.modelValue];
  const index = current.indexOf(value);
  if (index === -1) {
    current.push(value);
  } else {
    current.splice(index, 1);
  }
  emit('update:modelValue', current);
};
</script>
