<template>
  <div class="flex-1">
    <label v-if="label != null" :for="name" class="text-xs text-text-500 font-medium" :class="customLabelClass">
      {{ label }}<span v-if="required" class="text-red-600">*</span>
      <span class="text-primary-500 italic" v-if="title_desc"> {{ title_desc ?? '' }} </span>
    </label>
    <p class="mb-2 text-sm text-gray-700" v-if="description"> {{ description }} </p>
    <div class="flex gap-2">
      <div
        class="p-[3px] rounded-lg border border-border-dark w-fit relative cursor-pointer"
        @click="$refs.input.click()"
      >
        <div
          class="w-9 h-9 rounded-full border border-border-dark"
          :style="{ backgroundColor: color }"
        ></div>

        <input ref="input" class="sr-only" type="color" v-model="color" />
      </div>

      <input
        type="text"
        v-model="color"
        :required="required"
        class="h-[42px] w-full flex-1 rounded-lg p-3 border bg-base-light border-border-light focus:outline-primary-500"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "#000000",
    },
    name: {
      type: String,
      default: "color",
    },
    label: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    title_desc: {
      type: String,
      default: null,
    },
    customLabelClass: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    color: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  }
};
</script>
