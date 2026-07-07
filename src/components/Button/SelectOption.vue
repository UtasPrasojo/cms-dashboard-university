<template>
    <div class="relative inline-block" ref="rootRef">
        <button type="button" class="select-option" :class="{ 'select-option--disabled': disabled }"
            :disabled="disabled" @click="toggle">
            <span class="select-option__label" :class="labelSize">
                <slot name="label">{{ label }}</slot>
            </span>
            <span class="select-option__icon" :class="iconSize">
                <i class="fi fi-rr-angle-small-down block leading-[0] text-[14px] transition-transform"
                    :class="{ 'rotate-180': isOpen }"></i>
            </span>
        </button>

        <div v-if="isOpen" class="select-option__dropdown" :class="align === 'left' ? 'left-0' : 'right-0'"
            @click="handleOptionClick">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    size: {
        type: String,
        default: "medium",
        validator: (value) => ["small", "medium", "large"].includes(value),
    },
    align: {
        type: String,
        default: "right",
        validator: (value) => ["left", "right"].includes(value),
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    closeOnSelect: {
        type: Boolean,
        default: true,
    },
});

const label_size = {
    small: "pl-4 pr-2 py-2",
    medium: "pl-4 pr-2 py-3",
    large: "pl-5 pr-2 py-4",
};

const icon_size = {
    small: "px-[5px] py-2.5",
    medium: "px-[5px] py-3.5",
    large: "px-2 py-4",
};

const labelSize = computed(() => label_size[props.size]);
const iconSize = computed(() => icon_size[props.size]);

const isOpen = ref(false);
const rootRef = ref(null);

const toggle = () => {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;
};

const handleOptionClick = () => {
    if (props.closeOnSelect) isOpen.value = false;
};

const handleClickOutside = (event) => {
    if (rootRef.value && !rootRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>

<style scoped>
.select-option {
    @apply flex flex-row items-stretch rounded-full overflow-hidden transition-colors;
}

.select-option:disabled {
    @apply cursor-auto;
}

.select-option__label {
    @apply whitespace-nowrap text-xs md:text-sm font-semibold text-base-white bg-primary-500 transition-colors flex items-center;
}

.select-option:hover .select-option__label {
    @apply bg-primary-600;
}

.select-option__icon {
    @apply flex items-center justify-center h-full text-base-white bg-primary-700 transition-colors;
}

.select-option:hover .select-option__icon {
    @apply bg-primary-900;
}

.select-option--disabled .select-option__label,
.select-option--disabled:hover .select-option__label {
    @apply bg-base-section text-text-300;
}

.select-option--disabled .select-option__icon,
.select-option--disabled:hover .select-option__icon {
    @apply bg-base-section text-text-300;
}

.select-option__dropdown {
    @apply absolute z-20 mt-2 min-w-[200px] w-fit bg-base-white p-2 shadow-md rounded-xl;
}

/* Helper untuk item opsi di dalam dropdown: ikon bulat + label sejajar */
.select-option-item {
    @apply w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-base-black hover:bg-base-section transition-colors cursor-pointer whitespace-nowrap;
}

.select-option-item__icon {
    @apply w-9 h-9 shrink-0 rounded-full bg-base-black text-base-white grid place-items-center;
}

.select-option-item__icon i,
.select-option-item__icon svg {
    @apply text-base leading-none w-4 h-4;
}
</style>
