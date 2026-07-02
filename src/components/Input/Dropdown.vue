<template>
  <div ref="dropdown_container" :class="disabled ? 'pointer-events-none' : ''">
    <p v-if="label" class="text-xs md:text-sm mb-1">
      {{ label }}<span class="text-red-500" v-if="required">*</span>
    </p>
    <div v-if="!disabled" class="relative">
      <button ref="dropdown_button" type="button" :disabled="disabled"
        class="flex px-3 w-full py-2 font-medium text-xs md:text-sm border border-border-200 rounded-3xl text-text-500"
        :class="[computedClass]" @click="openModal()" @keydown="handleButtonKeydown">
        <div class="flex justify-between w-full text-xs md:text-sm">
          <div class="flex items-center gap-1 pr-1">
            <p class="text-start text-[#6E6E6E]">Show : {{ displayLabel }}</p>
            <div
              class="flex items-center bg-[information-100] text-information-500 rounded-lg text-xs md:text-sm px-3 py-1 font-semibold"
              v-if="selected?.desc">
              {{ selected?.desc }}
            </div>
          </div>
          <div class="flex justify-center items-center w-6 h-6 rounded-full bg-base-dark">
            <i v-if="!disabled" class="inline-flex items-center justify-center text-white"
              :class="[icon ? `fi ${icon}` : `fi fi-rr-angle-small-down ${show ? 'rotate-180' : ''}`] "></i>
          </div>
        </div>
      </button>
      <div class="w-full h-full absolute top-0 px-[1px] pointer-events-none">
        <input @invalid="handleInvalid()" :disabled="disabled" type="text" class="input-style pointer-events-none"
          tabindex="-1" :required="required" :name="label" :value="modelValue" />
      </div>
    </div>
    <div v-else
      class="relative flex px-3 w-full py-2 font-medium text-xs md:text-sm border border-border-400 rounded-lg text-text-500 bg-surface-primary cursor-not-allowed select-none">
      <div class="flex justify-between w-full text-xs md:text-sm">
        <div class="flex items-center gap-1">
          <p>{{ displayLabel }}</p>
          <div
            class="flex items-center bg-information-100 text-information-500 rounded-lg text-xs md:text-sm px-3 py-1 font-semibold"
            v-if="selected?.desc">
            {{ selected?.desc }}
          </div>
        </div>
      </div>
    </div>
    <p class="mt-1 font-bold leading-none text-[9px] text-primary-500" v-if="description">
      {{ description ?? "" }}
    </p>
    <Teleport to="body">
      <div v-if="show && !disabled" class="w-full">
        <div class="fixed top-0 left-0 w-screen h-screen bg-transparent z-40" @click="closeModal()"
          @wheel.passive="closeModal()" @touchmove.passive="closeModal()"></div>
        <div ref="dropdown_menu" tabindex="0"
          class="fixed bg-base-white border border-gray-300 rounded-lg z-50 elevation-2 overflow-hidden focus:outline-none"
          :class="on_top ? '-translate-y-[calc(100%+50px)]' : ''" :style="`width: ${dropdown_container.clientWidth}px; top: ${dropdown_container.getBoundingClientRect().y +
            dropdown_container.clientHeight
            }px; left: ${dropdown_container.getBoundingClientRect().x}px`" @keydown="handleMenuKeydown">
          <div class="flex flex-col gap-1 p-2 w-full max-h-[300px] overflow-hidden">
            <div v-if="with_search">
              <input ref="search_input" name="search"
                class="w-full p-3 border text-xs md:text-sm border-primary-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                type="text" placeholder="Pencarian ..." v-model="search_value" @keydown="handleSearchKeydown"
                @input="handleSearchInput" @focus="handleSearchFocus" :label="null" />
            </div>
            <div ref="options_container" class="grid overflow-auto gap-0">
              <template v-if="filteredOptions.length > 0">
                <template v-for="(opt, index) in filteredOptions" :key="opt.value">
                  <p v-if="typeof opt == 'string'" class="text-start text-xs md:text-sm p-3 text-text-500 font-bold">
                    {{ opt }}
                  </p>
                  <button type="button" @click="selectOption(opt)" v-else ref="option_buttons" tabindex="-1"
                    :data-index="index" class="flex rounded items-center gap-1 text-start text-xs md:text-sm py-2 px-4"
                    :class="[
                      modelValue == opt.value
                        ? 'bg-primary-500 text-base-white'
                        : 'hover:bg-base-section',
                      highlightedIndex === index ? 'bg-primary-50' : '',
                    ]">
                    {{ opt.label }}
                    <div
                      class="flex items-center bg-information-100 text-information-500 rounded-lg text-[10px] px-3 py-1 font-semibold"
                      v-if="opt?.desc">
                      {{ opt?.desc }}
                    </div>
                  </button>
                </template>
              </template>
              <p v-else class="flex items-center gap-1 text-start text-[11px] leading-3 p-2 text-text-400">
                <IconSearchEmpty class="flex-none" />
                <span>Pencarian tidak ditemukan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { useHelperStore } from "@/stores/helper.store";
import { computed, watch, ref, nextTick, onUnmounted } from "vue";

const helperStore = useHelperStore();
const dropdown_menu = ref();
const dropdown_container = ref();
const dropdown_button = ref();
const search_input = ref();
const options_container = ref();
const option_buttons = ref([]);

/**
 * @type {{
 * name: String,
 * modelValue: [String, Number, Boolean, Object, Array],
 * options: Array,
 * with_search: Boolean,
 * label: String,
 * placeholder: String,
 * required: Boolean,
 * disabled: Boolean,
 * description: String
 * variant: input | filter
 * }}
 */

const props = defineProps({
  name: { type: String, default: "" },
  modelValue: { type: [String, Number, Boolean, Object, Array], default: null },
  options: { type: Array, required: true },
  with_search: { type: Boolean, default: false },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  icon: { type: String, default: null },
  description: { type: String, default: null },
  variant: { type: String, default: "input" },
});
const emit = defineEmits(["update:modelValue", "search", "selected"]);

const show = ref(false);
const search_value = ref("");
const selected = ref(null);
const timeout = ref(null);
const on_top = ref(false);
const error = ref(false);
const highlightedIndex = ref(-1);
const isNavigatingWithKeyboard = ref(false);
const ignore_scroll = ref(false);
const ignore_scroll_timeout = ref(null);

// Pada iOS/iPadOS, keyboard virtual yang muncul memicu viewport resize
// yang men-trigger scroll event di window — tanpa flag ini dropdown akan
// langsung tertutup saat user fokus ke search input.
const isTouchDevice = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const suspendScrollClose = (ms = 500) => {
  ignore_scroll.value = true;
  clearTimeout(ignore_scroll_timeout.value);
  ignore_scroll_timeout.value = setTimeout(() => {
    ignore_scroll.value = false;
  }, ms);
};

const handleSearchFocus = () => {
  suspendScrollClose();
};

// Filter hanya options yang bukan string (header)
const filteredOptions = computed(() => {
  return props.options.filter((opt) => typeof opt !== "string");
});

const handleInvalid = () => {
  nextTick(() => {
    error.value = true;
  });
};

const inputDebounce = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    emit("search", search_value.value);
  }, 300);
};

const selectOption = (opt) => {
  emit("update:modelValue", opt.value);
  closeModal();
  emit("selected", opt);
};

const scrollToHighlighted = () => {
  nextTick(() => {
    if (
      highlightedIndex.value >= 0 &&
      option_buttons.value[highlightedIndex.value]
    ) {
      const button = option_buttons.value[highlightedIndex.value];
      const container = options_container.value;

      if (button && container) {
        const buttonTop = button.offsetTop;
        const buttonBottom = buttonTop + button.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (buttonBottom > containerBottom) {
          container.scrollTop = buttonBottom - container.clientHeight;
        } else if (buttonTop < containerTop) {
          container.scrollTop = buttonTop;
        }
      }
    }
  });
};

// Handler keyboard untuk button (sebelum dropdown terbuka)
const handleButtonKeydown = (e) => {
  if (!show.value) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openModal();
    }
  }
};

// Handler keyboard untuk search input
const handleSearchKeydown = (e) => {
  const maxIndex = filteredOptions.value.length - 1;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        highlightedIndex.value =
          highlightedIndex.value < 0
            ? 0
            : Math.min(highlightedIndex.value + 1, maxIndex);
        isNavigatingWithKeyboard.value = true;
        dropdown_menu.value?.focus(); // Focus menu container
        scrollToHighlighted();
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        highlightedIndex.value =
          highlightedIndex.value < 0
            ? maxIndex
            : Math.max(highlightedIndex.value - 1, 0);
        isNavigatingWithKeyboard.value = true;
        dropdown_menu.value?.focus(); // Focus menu container
        scrollToHighlighted();
      }
      break;

    case "Escape":
      e.preventDefault();
      search_value.value = "";
      emit("search", "");
      closeModal();
      dropdown_button.value?.focus();
      break;

    case "Enter":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        const optToSelect =
          highlightedIndex.value >= 0
            ? filteredOptions.value[highlightedIndex.value]
            : filteredOptions.value[0];
        selectOption(optToSelect);
      }
      break;
  }
};

// Handler input untuk search (saat mengetik)
const handleSearchInput = () => {
  highlightedIndex.value = -1;
  isNavigatingWithKeyboard.value = false;
  inputDebounce();
};

// Handler keyboard untuk menu dropdown
const handleMenuKeydown = (e) => {
  // Jika search input yang fokus, jangan handle di sini
  if (props.with_search && document.activeElement === search_input.value) {
    return;
  }

  const maxIndex = filteredOptions.value.length - 1;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (highlightedIndex.value < maxIndex) {
        highlightedIndex.value++;
      } else {
        highlightedIndex.value = 0; // Loop to first
      }
      isNavigatingWithKeyboard.value = true;
      scrollToHighlighted();
      break;

    case "ArrowUp":
      e.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      } else {
        highlightedIndex.value = maxIndex; // Loop to last
      }
      isNavigatingWithKeyboard.value = true;
      scrollToHighlighted();
      break;

    case "Enter":
      e.preventDefault();
      if (
        highlightedIndex.value >= 0 &&
        filteredOptions.value[highlightedIndex.value]
      ) {
        const opt = filteredOptions.value[highlightedIndex.value];
        selectOption(opt);
      }
      break;

    case "Escape":
      e.preventDefault();
      closeModal();
      dropdown_button.value?.focus();
      break;

    case "Tab":
      e.preventDefault();
      closeModal();
      break;

    // Return to search with any letter key
    default:
      if (props.with_search && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        search_input.value?.focus();
        search_value.value += e.key;
        highlightedIndex.value = -1;
        isNavigatingWithKeyboard.value = false;
        inputDebounce();
      }
      break;
  }
};

const handleScroll = (e) => {
  if (ignore_scroll.value) {
    return;
  }
  // Don't close if scrolling inside the dropdown
  if (dropdown_menu.value && dropdown_menu.value.contains(e.target)) {
    return;
  }
  if (options_container.value && options_container.value.contains(e.target)) {
    return;
  }
  closeModal();
};

const openModal = () => {
  show.value = true;
  error.value = false;
  highlightedIndex.value = -1;
  isNavigatingWithKeyboard.value = false;

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, true);

  nextTick(() => {
    on_top.value =
      dropdown_menu.value.getBoundingClientRect().bottom >
      document.getElementById("app").getBoundingClientRect().bottom;

    // Di touch device (iPad/iOS), auto-focus ke search input memicu virtual
    // keyboard → viewport resize → window scroll event → dropdown menutup
    // secara instant. Skip auto-focus search di touch device; user bisa tap
    // search input secara manual jika perlu.
    if (props.with_search && search_input.value && !isTouchDevice) {
      search_input.value.focus();
    } else {
      dropdown_menu.value?.focus();
    }

    // Set highlighted ke selected item
    const selectedIdx = filteredOptions.value.findIndex(
      (opt) => opt.value === props.modelValue,
    );
    if (selectedIdx >= 0) {
      highlightedIndex.value = selectedIdx;
      scrollToHighlighted();
    }
  });
};

const closeModal = () => {
  show.value = false;
  on_top.value = false;
  highlightedIndex.value = -1;
  isNavigatingWithKeyboard.value = false;

  // Remove scroll listener
  window.removeEventListener('scroll', handleScroll, true);
  clearTimeout(ignore_scroll_timeout.value);
  ignore_scroll.value = false;

  if (props.with_search) {
    search_value.value = "";
    emit("search", "");
  }
};

const displayLabel = computed(() => {
  if (selected.value?.value) {
    return selected.value.label;
  }
  if (props.placeholder) {
    return props.placeholder;
  }
  return "Pilih Opsi";
});

const computedClass = computed(() => {
  let className = [];
  if (error.value) return "button-error";

  if (show.value) {
    className.push(
      props.variant === "filter" ? "button-active-filter" : "button-active",
    );
  } else {
    className.push(
      props.variant === "filter" ? "button-inactive-filter" : "button-inactive",
    );
  }

  if (props.disabled) {
    className.push("!bg-[gray-100] !border-border-100");
  }

  return className.join(" ");
});

watch(
  () => props.modelValue,
  () => {
    selected.value = props.options?.find(
      (opt) => opt.value == props.modelValue,
    );
    error.value = false;
  },
  { immediate: true, deep: true },
);

watch(
  () => "helperStore.form_error",
  () => {
    error.value = helperStore.form_error.some(
      (res) => res?.item_name == props.name,
    );
  },
  { deep: true, immediate: true },
);

onUnmounted(() => {
  helperStore.form_error = [];
  window.removeEventListener('scroll', handleScroll, true);
  clearTimeout(ignore_scroll_timeout.value);
});
</script>

<style scoped>
.button-inactive {
  @apply hover:bg-slate-50 text-sm focus:outline-primary-500 bg-surface-primary focus:bg-primary-50;
}

.button-active {
  @apply border-primary-500  hover:bg-slate-50 text-sm;
}

.button-inactive-filter {
  @apply  hover:bg-slate-50 text-sm focus:outline-primary-500 focus:bg-primary-50;
}

.button-active-filter {
  @apply border-primary-500 bg-primary-50 hover:bg-slate-50 text-sm;
}

.button-error {
  @apply border-red-500 bg-red-50/50 text-sm;
}

.input-style {
  @apply appearance-none w-full h-full opacity-0 pointer-events-none;
}
</style>
