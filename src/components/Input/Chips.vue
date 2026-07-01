<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-xs font-bold text-[#303030]">{{
      label
    }}</label>

    <!-- chips -->
    <div class="flex flex-wrap gap-2" v-if="list.length > 0">
      <div :class="[
          `px-4 py-1 rounded-full text-center capitalize w-fit h-fit flex-none whitespace-nowrap`,
          sizeStyle[size],
          colorStyle[type],
          weightStyle[weight]
        ]"
        v-for="(item, i) in list"
        :key="i"
        :type="color"
      >
        {{ item }}
        <button
          class="ml-1 text-[10px] lg:text-xs"
          @click="remove(i)"
          aria-label="Hapus"
          type="button"
        >
          <i class="ri-close-line text-black"></i>
        </button>
      </div>
    </div>

    <!-- input -->
    <div class="relative">
      <div class="flex gap-[5px]">
        <InputText
          ref="input"
          v-model="value"
          :placeholder="placeholder"
          class="flex-1"
          @keydown.enter.prevent="add"
        />
        <button
          class="px-3 py-1 rounded-xl bg-primary-500 text-white"
          :disabled="!canAdd"
          type="button"
          @click="add"
        >
          <i class="ri-add-line"></i>
        </button>
      </div>
      <input ref="input" 
        :required="required" 
        type="text" 
        class="sr-only" 
        v-model="form_validation"
        @invalid="messageError=validation; $refs.inputElement.setCustomValidity(!form_validation ? 'Input tidak boleh kosong!' : validation)" 
      >
      <p class="text-[10px]">{{ desc }}</p>
      <p v-if="messageError" class="text-[10px] text-red-500">
        {{ messageError }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputChips",
  props: {
    label: { type: String, default: 'label' },
    placeholder: { type: String, default: "Tambah.." },
    modelValue: { type: Array, default: () => [] },
    color: { type: String, default: "blue" },
    desc: { type: String, default: "tekan Enter untuk menambah." },
    name: { type: String, default: "chips" },
    type: {
      type: String,
      default: 'blue'
    },
    size: {
      type: String,
      default: 'md'
    },
    weight: {
      type: String,
      default: 'medium'
    },
    required: {
      type: Boolean,
      default: true,
    },
    validation: {
      type: String,
      default: 'Input tidak boleh kosong!',
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: "",
      messageError: "",
      form_validation: null,
      error: false,
      colorStyle: {
        red: 'bg-[#FEDFDD] text-[#FB6056]',
        green: 'bg-[#D0F3EB] text-[#119C7F]',
        blue: 'bg-[#EBF0FF] text-[#4070FF]',
        yellow: 'bg-[#FFF9EC] text-[#FFCB45]',
        orange: 'bg-[#FFF1E9] text-[#FF6723]',
        purple: 'bg-[#EFEBF9] text-[#663BCB]',
        gray: 'bg-text-200 text-text-400'
      },
      sizeStyle: {
        sm: 'text-[10px] leading-3',
        md: 'text-xs leading-4',
        lg: 'text-sm leading-5',
      },
      weightStyle: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-semibold'
      }
    };
  },
  computed: {
    // Selalu aman meski parent mengirim null
    list() {
      return Array.isArray(this.modelValue) ? this.modelValue : [];
    },
    canAdd() {
      const v = (this.value ?? "").trim();
      if (!v) return false;
      // cegah duplikat (case-insensitive)
      return !this.list.some(
        (x) => String(x).toLowerCase() === v.toLowerCase()
      );
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        this.form_validation = value.map((x) => String(x).trim()).join(",");
      }
    }
  },
  mounted() {
    this.form_validation = this.modelValue.map((x) => String(x).trim()).join(",");
  },

  methods: {
    add() {
      this.messageError = "";
      if (!this.canAdd) {
        this.messageError = "tidak boleh ada duplikat!";
        return;
      }
      const next = [...this.list, (this.value ?? "").trim()];
      this.$emit("update:modelValue", next);
      this.value = "";
      this.$nextTick(() => this.$refs.input?.focus?.());
    },
    remove(i) {
      const next = this.list.slice();
      next.splice(i, 1);
      this.$emit("update:modelValue", next);
    },
  },
  // Opsional: normalkan awalnya bila parent kirim null
  created() {
    if (!Array.isArray(this.modelValue)) this.$emit("update:modelValue", []);
  },
};
</script>
