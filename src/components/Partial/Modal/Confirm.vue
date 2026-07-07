<template>
  <Teleport to="#app">
    <div
      v-if="modelValue"
      @click.self="handleCloseBackground"
      class="z-50 fixed left-0 top-0 grid justify-items-center content-center w-screen h-screen bg-base-black/40 p-5"
    >
      <div class="p-4 bg-base-white rounded-lg elevation-6 w-full max-w-[420px]">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <div class="flex flex-row justify-between" v-if="!iconFull">
              <div
                class="relative items-center rounded-full px-3.5 py-2 h-10 w-10"
              >
                <div
                  class="absolute rounded-full inset-0 -z-1 scale-125 animate-pulse"
                  :class="colors[variant].layer_2"
                ></div>
                <div
                  class="absolute rounded-full inset-0 z-1 scale-100"
                  :class="colors[variant].layer_1"
                ></div>
                <span
                  class="absolute flex items-center justify-center transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2"
                >
                  <i
                    class="text-base leading-none text-base-white z-2"
                    :class="icon ?? defaultIcon[variant]"
                  ></i>
                </span>
              </div>
              <button
                type="button"
                @click="
                  handleCancel
                "
                class="h-fit rounded bg-base-section px-1"
              >
                <i
                  class="fi-rr-cross-small text-sm leading-none text-text-500"
                ></i>
              </button>
            </div>
            <div class="flex h-[150px] rounded-lg items-center justify-center relative" :class="colors[variant].layer_1" v-else>
              <img src="@/assets/illustration-confirm.svg" alt="illustration" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-[70px] h-[70px] border-4 border-white rounded-full flex items-center justify-center" :class="colors[variant].layer_3">
                <i class="fi-rr-warning text-[32px] leading-none text-base-white" :class="icon ?? defaultIcon[variant]"></i>
              </div>
              <button
                type="button"
                @click="handleCancel
                "
                class="h-fit rounded bg-base-section px-1 absolute top-2 right-2"
              >
                <i
                  class="fi-rr-cross-small text-sm leading-none text-text-500"
                ></i>
              </button>
            </div>
            <div v-if="title || desc" class="flex flex-col gap-1">
              <div v-if="title" class="font-bold text-sm text-base-black">
                {{ title }}
              </div>
              <div v-if="desc" class="font-medium text-sm text-text-400" v-html="desc"></div>
            </div>
          </div>
          <div data-modal class="relative text-sm text-base-black">
            <slot />
          </div>
          <template v-if="!hideAction">
            <hr />
            <div class="grid grid-cols-2 gap-3" v-if="!enableCostume">
              <ButtonDangerOutline
                size="small"
                v-if="variantCancel == 'error'"
                @click="handleCancel">
                {{ cancel }}
              </ButtonDangerOutline>
              <ButtonPrimaryOutline
                size="small"
                v-else
                @click="handleCancel">
                {{ cancel }}
              </ButtonPrimaryOutline>

              <ButtonDanger
                size="small"
                @click="submit"
                :disabled="disabled"
                v-if="variant == 'error'"
                >{{ confirm }}</ButtonDanger
              >
              <ButtonSuccess
                size="small"
                @click="submit"
                :disabled="disabled"
                v-else-if="variant == 'success'"
                >{{ confirm }}</ButtonSuccess
              >
              <ButtonPrimary
                size="small"
                @click="submit"
                :disabled="disabled"
                v-else
                >{{ confirm }}</ButtonPrimary
              >
            </div>
            <div v-else>
              <slot name="action"/>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/**
 * @type {{
 *  modelValue: String, Boolean, Object,
 *  title: String,
 *  desc: String,
 *  variant: "primary" | "success" | "warning" | "error",
 *  variantCancel: "primary" | "success" | "warning" | "error",
 *  icon: String.
 *  cancel: String,
 *  confirm: String,
 *  disabled: Boolean,
 *  persistent: Boolean,
 *  disableClose: Boolean
 *  iconFull: Boolean
 *  enableCostume: Boolean
 *  withoutCancel: Boolean
 *  @onConfirmed: function
 *  @close: function
 * }}
 */
const props = defineProps({
  modelValue: {
    type: [String, Boolean, Object],
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  desc: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: "primary",
  },
  variantCancel: {
    type: String,
    default: "primary",
  },
  cancel: {
    type: String,
    default: "Batalkan",
  },
  confirm: {
    type: String,
    default: "Konfirmasi",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: null,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  disableClose: {
    type: Boolean,
    default: false,
  },
  iconFull: {
    type: Boolean,
    default: false
  },
  enableCostume: {
    type: Boolean,
    default: false
  },
  hideAction: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update:modelValue", "close", "onConfirmed"]);

const colors = {
  primary: {
    layer_1: "bg-primary-500",
    layer_2: "bg-primary-100",
    layer_3: "bg-primary-600",
  },
  error: {
    layer_1: "bg-error-500",
    layer_2: "bg-error-100",
    layer_3: "bg-error-600",
  },
  warning: {
    layer_1: "bg-warning-500",
    layer_2: "bg-warning-100",
    layer_3: "bg-warning-600",
  },
  success: {
    layer_1: "bg-success-500",
    layer_2: "bg-success-100",
    layer_3: "bg-success-600",
  },
};

const defaultIcon = {
  primary: "fi fi-rr-check-circle",
  error: "fi fi-rr-limit-hand",
  warning: "fi fi-rr-triangle-warning",
  success: "fi fi-rr-check-circle",
};

const handleCloseBackground = () => {
  if (props.persistent) return
  emits('update:modelValue', false)
  if (props.disableClose) return;
  emits('close')
}

const handleCancel = () => {
  emits("close");
  if (props.disableClose) return;
  emits("update:modelValue", false);
};

const submit = () => {
  // cari form di dalam modal
  const modal = document.querySelector("[data-modal]");
  const form = modal?.querySelector("form");

  if (form) {
    form.requestSubmit(); // <-- ini memicu required bawaan HTML
    return;
  }

  // kalau tidak ada form, fallback ke emit manual
  emits("onConfirmed");
  emits("update:modelValue", false);
  emits("close");
};
</script>
