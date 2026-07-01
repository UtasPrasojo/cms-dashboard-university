<template>
  <div class="grid gap-1">
    <label v-if="label != null" :for="name" class="text-xs">
      {{ label }}<span v-if="required" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <input
        ref="inputElement"
        :required="required"
        type="text"
        class="sr-only"
        v-model="form_validasi"
        @invalid="onInvalid"
      />

      <div class="border rounded-xl overflow-hidden" :class="error ? 'border-[#FB6056]' : ''">
        <QuillEditor
          ref="editor"
          v-model:content="value"
          contentType="delta"
          theme="snow"
          :toolbar="toolbar"
          :placeholder="placeholder"
          style="height: 500px"
          @text-change="onEditorChange"
        />
        <div class="p-2 bg-[#FEEFEE]" v-if="error">
          <p class="text-[10px] text-[#FB6056]">
            {{ validation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Delta from "quill-delta";

export default {
  props: {
    label: { type: String, default: null },
    name: { type: String, default: null },
    required: { type: Boolean, default: false },
    modelValue: { default: () => new Delta() },
    placeholder: { type: String, default: "Tulis sesuatu di sini..." },
    text: { type: String, default: null },
    validation: { type: String, default: "Input tidak boleh kosong!" },
  },
  emits: ["update:modelValue", "update:text"],
  data() {
    return {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ header: [1, 2, false] }],
        [{ align: [] }],
        ["link"],
        ["image"],
      ],
      form_validasi: "",
      messageError: "",
      error: false,
    };
  },
  computed: {
    value: {
      get() {
        try {
          if (this.modelValue && typeof this.modelValue === "object" && this.modelValue.ops) {
            return new Delta(this.modelValue);
          }
        } catch (e) {
          messageError = e.message;
        }
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);

        const editor = this.$refs.editor;
        let text = "";
        try {
          if (editor && typeof editor.getText === "function") {
            text = editor.getText();
          }
        } catch (e) {
          messageError = e.message;
        }
        this.form_validasi = text || "";
        this.$emit("update:text", text);
        this.error = this.required && !this.form_validasi;
      },
    },
  },
  watch: {
    modelValue: {
      handler(newVal) {
        const editor = this.$refs.editor;
        let text = "";
        try {
          if (editor && typeof editor.getText === "function") {
            text = editor.getText();
          } else if (newVal && typeof newVal === "object" && newVal.ops) {
            text = newVal.ops.map(op => (op.insert ? op.insert : "")).join("");
          } else if (typeof newVal === "string") {
            text = newVal;
          }
        } catch (e) {
          messageError = e.message;
        }
        this.form_validasi = text;
        this.error = this.required && !this.form_validasi;
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.syncFromEditor();
  },
  methods: {
    onInvalid(event) {
      const input = this.$refs.inputElement;
      if (!input) return;

      const isEmpty = !this.form_validasi || this.form_validasi.trim() === "";
      input.setCustomValidity(isEmpty ? this.validation : "");
      this.error = isEmpty;
    },
    onEditorChange(delta, oldDelta, source) {
      try {
        const editor = this.$refs.editor;
        if (!editor || typeof editor.getText !== "function") return;

        const text = editor.getText();
        this.form_validasi = text || "";
        this.error = this.required && !this.form_validasi;
        this.$emit("update:text", text);
      } catch (e) {
        this.form_validasi = "";
        this.error = this.required;
      }
    },
    syncFromEditor() {
      try {
        const editor = this.$refs.editor;
        if (!editor || typeof editor.getText !== "function") {
          if (this.modelValue && this.modelValue.ops) {
            const text = this.modelValue.ops.map(op => (op.insert ? op.insert : "")).join("");
            this.form_validasi = text;
          } else if (typeof this.modelValue === "string") {
            this.form_validasi = this.modelValue;
          } else {
            this.form_validasi = "";
          }
        } else {
          const text = editor.getText();
          this.form_validasi = text || "";
        }
      } catch (e) {
        this.form_validasi = "";
      }
      this.error = this.required && !this.form_validasi;
    },
  },
};
</script>

<style scoped>
:deep(.ql-toolbar) {
  @apply bg-[#F9FAFF] text-[#475569] !border-t-transparent !border-l-transparent !border-r-transparent;
}
:deep(.ql-container) {
  @apply bg-[#F9FAFF] text-[#475569] !border-transparent;
}
:deep(h1) {
  @apply text-sm lg:text-[24px] font-semibold mb-2;
}
:deep(h2) {
  @apply text-sm lg:text-base font-semibold mb-2;
}
:deep(h3) {
  @apply lg:text-sm text-sm font-semibold leading-none mb-2;
}
:deep(p) {
  @apply text-xs lg:text-sm mb-2;
}
:deep(ul) {
  @apply list-disc pl-5 text-xs lg:text-sm;
}
:deep(ol) {
  @apply list-decimal pl-5 text-xs lg:text-sm;
}
:deep(li) {
  @apply mb-2;
}
</style>
