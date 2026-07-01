<template>
  <button type="button" :title="title" class="grid place-items-center group w-[21px] h-[21px] rounded-[4px]" :class="colors[type]">
    <i :class="[icon, textColors[type]]" class="group-hover:text-primary-100 text-xs mt-0.5 !leading-none" />
  </button>
</template>

<script setup>
/**
 * @type {{
  title: String,
  type: String,
  icon: String
 }}
 */
defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "primary",
  },
  icon: {
    type: String,
    required: true,
  },
});

const colors = {
  primary: "bg-primary-100 hover:bg-primary-500 disabled:bg-primary-100",
  success: "bg-success-100 hover:bg-success-500 disabled:bg-success-100",
  information: "bg-information-100 hover:bg-information-500 disabled:bg-information-100",
  warning: "bg-warning-100 hover:bg-warning-500 disabled:bg-warning-100",
  error: "bg-error-100 hover:bg-error-500 disabled:bg-error-100",
};

const textColors = {
  primary: "text-primary-500 group-disabled:text-primary-300",
  success: "text-success-500 group-disabled:text-success-300",
  information: "text-information-500 group-disabled:text-information-300",
  warning: "text-warning-600 group-disabled:text-warning-300",
  error: "text-error-500 group-disabled:text-error-300",
};
</script>
