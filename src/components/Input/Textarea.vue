<template>
  <div class="grid gap-1">
    <label v-if="label" :for="name" class="textarea-label">
      {{ label }}<span v-if="required" class="text-error-600">*</span>
    </label>
      <textarea
        class="textarea"
        type="text"
        v-model="value"
        :id="name"
        :name="name"
        :rows="rows"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :required="required"
      >
      </textarea>
    <p class="font-bold leading-none text-[9px] text-primary-500" v-if="description"> {{ description ?? '' }} </p>
  </div>
</template>
<script setup>
import { computed } from "vue";

/**
 * @type {{
 *   modelValue: string,
 *   maxlength: number,
 *   name: string,
 *   label: string,
 *   placeholder: string,
 *   required: boolean,
 *   rows: number,
 *   disabled: boolean
 * }}
 */
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  maxlength: {
    type: Number,
    default: 200,
  },
  name: {
    type: String,
    default: "title",
  },
  label: {
    type: String,
    default: "Label",
  },
  placeholder: {
    type: String,
    default: "Placeholder",
  },
  description: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 5,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style scoped>
.textarea-label {
  @apply font-medium text-xs md:text-sm text-base-black;
}
.textarea {
  @apply w-full text-xs md:text-sm rounded-lg bg-surface-primary border border-border-400 py-2 px-3;
}
.textarea:focus {
  @apply outline-primary-500 bg-primary-50;
}
.textarea:disabled {
  @apply border-border-100 text-base-grey;
}
</style>
