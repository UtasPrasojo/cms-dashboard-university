<template>
  <div class="w-full" ref="rootRef">
    <!-- Label -->
    <label v-if="label" class="block text-sm text-gray-900 mb-2">
      {{ label }} <span v-if="required" class="text-primary-500">*</span>
    </label>

    <div class="relative w-full">
      <!-- Button utama -->
      <button
        ref="buttonRef"
        class="w-full flex items-center justify-between gap-2 px-5 py-2 bg-[#F9FAFB] border border-[#DBDBDB] rounded-2xl text-left transition-colors"
        :class="disabled ? 'opacity-50 cursor-auto' : 'cursor-pointer'"
        :disabled="disabled"
        @click="toggleDropdown"
        type="button"
      >
        <span
          class="text-sm md:text-base truncate"
          :class="isPlaceholder ? 'text-[#DBDBDB]' : 'text-gray-900'"
        >
          {{ selectedLabel }}
        </span>

        <ChevronUpIcon v-if="isOpen" class="w-5 h-5 text-gray-700 shrink-0" />
        <ChevronDownIcon v-else class="w-5 h-5 text-gray-700 shrink-0" />
      </button>
    </div>

    <!-- Dropdown: diteleport ke body supaya tidak terpotong overflow modal/parent -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="fixed bg-white border border-[#DBDBDB] rounded-2xl shadow-lg z-50 p-3"
        :style="dropdownStyle"
      >
        <!-- Search -->
        <div class="relative mb-2">
          <input
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-4 pr-10 py-3 bg-[#F9FAFB] border border-[#DBDBDB] rounded-2xl text-sm text-gray-900 placeholder-[#DBDBDB] focus:outline-none"
          />
          <MagnifyingGlassIcon
            class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        <!-- Options -->
        <ul class="max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          <li
            v-for="(option, index) in filteredOptions"
            :key="index"
            @click="selectOption(option)"
            class="px-4 py-3 mb-1 rounded-2xl cursor-pointer text-sm md:text-base transition-colors"
            :class="
              isSelected(option)
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            "
          >
            {{ option.label }}
          </li>

          <li
            v-if="filteredOptions.length === 0"
            class="px-4 py-3 text-sm text-gray-400 text-center"
          >
            Tidak ditemukan
          </li>
        </ul>

        <!-- Add new -->
        <div v-if="showAddNew" class="border-t border-gray-100 mt-2 pt-3">
          <button
            type="button"
            @click="handleAddNew"
            class="w-full text-center text-sm md:text-base text-primary-500 font-medium py-1 hover:opacity-80"
          >
            + {{ addNewLabel }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";

/**
 * Props:
 * - options: array dari parent [{ value: any, label: string }]
 * - label: label di atas select (mis. "Fakultas")
 * - required: tampilkan tanda * di sebelah label
 * - placeholder: teks saat belum ada value terpilih
 * - searchPlaceholder: teks placeholder input search
 * - showAddNew: tampilkan tombol "+ Tambah ..." di bawah list
 * - addNewLabel: label tombol tambah baru
 */
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Pilih",
  },
  searchPlaceholder: {
    type: String,
    default: "Cari",
  },
  showAddNew: {
    type: Boolean,
    default: false,
  },
  addNewLabel: {
    type: String,
    default: "Tambah baru",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "add-new"]);

const rootRef = ref(null);
const buttonRef = ref(null);
const dropdownRef = ref(null);
const isOpen = ref(false);
const search = ref("");
const dropdownStyle = ref({});

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
);

const selectedLabel = computed(() =>
  selectedOption.value ? selectedOption.value.label : props.placeholder
);

const isPlaceholder = computed(() => !selectedOption.value);

const filteredOptions = computed(() => {
  if (!search.value) return props.options;
  const query = search.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(query));
});

function isSelected(option) {
  return option.value === props.modelValue;
}

function updateDropdownPosition() {
  if (!buttonRef.value) return;
  const rect = buttonRef.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
}

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    nextTick(updateDropdownPosition);
  }
}

function handleReposition() {
  if (isOpen.value) updateDropdownPosition();
}

function selectOption(option) {
  emit("update:modelValue", option.value);
  isOpen.value = false;
  search.value = "";
}

function handleAddNew() {
  emit("add-new");
  isOpen.value = false;
  search.value = "";
}

// Klik di luar untuk menutup dropdown (dropdown diteleport ke body, jadi dicek terpisah dari rootRef)
function handleClickOutside(event) {
  const clickedRoot = rootRef.value && rootRef.value.contains(event.target);
  const clickedDropdown = dropdownRef.value && dropdownRef.value.contains(event.target);
  if (!clickedRoot && !clickedDropdown) {
    isOpen.value = false;
  }
}

window.addEventListener("click", handleClickOutside);

onMounted(() => {
  window.addEventListener("scroll", handleReposition, true);
  window.addEventListener("resize", handleReposition);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleReposition, true);
  window.removeEventListener("resize", handleReposition);
});

watch(isOpen, (val) => {
  if (!val) search.value = "";
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-primary-300;
  border-radius: 9999px;
}
</style>