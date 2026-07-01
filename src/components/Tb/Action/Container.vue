<template>
  <div ref="tb_action_container" class="w-fit mx-auto">
    <button
      ref="action_button"
      :title="title"
      type="button"
      class="tb-action-button"
      :disabled="disabled"
      @click="openModal"
      @keydown="handleKeydown"
    >
      <i class="fi fi-rr-menu-dots-vertical leading-none font-bold"></i>
    </button>
    <!-- Teleport ke body: lepas dari containing block ancestor (modal transform / overflow auto di iOS Safari) -->
    <Teleport to="body">
    <div v-if="show" class="w-full">
      <div
        class="fixed top-0 left-0 w-screen h-screen bg-transparent z-40"
        @click="closeModal"
        @wheel.passive="closeModal"
      ></div>
      <div
        ref="tb_action_menu"
        class="fixed bg-base-white border border-gray-300 rounded-lg z-50 elevation-2 w-fit"
        :style="dropdownStyle"
        @keydown="handleKeydown"
      >
        <div
          ref="menu_container"
          id="menu_container"
          class="flex flex-col w-[200px] p-2 rounded"
          @click="onSlotClick"
        >
          <slot/>
          <div v-if="!menuItems.length" class="flex items-center gap-1 p-2 text-sm text-primary-500">
            <i class="fi fi-rr-lock 1 leading-none"></i>
            Tidak Memiliki Akses
          </div>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onUnmounted, watch, useSlots } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'List'
  }
});

const emit = defineEmits(["update:modelValue", "openModal", "closeModal"]);

const show = ref(false);
const on_top = ref(false);
const tb_action_container = ref(null);
const tb_action_menu = ref(null);
const action_button = ref(null);
const menu_container = ref(null);
const highlightedIndex = ref(-1);
const menuItems = ref([]);
const dropdownPosition = ref({ top: 0, left: 0 });
const lengthMenu = ref(0);

const updateMenuItems = () => {
  nextTick(() => {
    if (menu_container.value) {
      menuItems.value = Array.from(
        menu_container.value.querySelectorAll(
          'button:not([disabled]), a, [role="menuitem"]:not([disabled])'
        )
      );
    }
  });
};

const handleSelect = (selected) => {
  emit("update:modelValue", selected);
  closeModal();
};

const scrollToHighlighted = () => {
  nextTick(() => {
    if (highlightedIndex.value >= 0 && menuItems.value[highlightedIndex.value]) {
      const item = menuItems.value[highlightedIndex.value];
      const container = menu_container.value;
      
      if (item && container) {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        
        if (itemBottom > containerBottom) {
          container.scrollTop = itemBottom - container.clientHeight;
        } else if (itemTop < containerTop) {
          container.scrollTop = itemTop;
        }
      }
    }
  });
};

const updateHighlightVisual = () => {
  menuItems.value.forEach((item, index) => {
    if (index === highlightedIndex.value) {
      item.classList.add('!bg-primary-500', '!text-base-white');
    } else {
      item.classList.remove('!bg-primary-500', '!text-base-white');
    }
  });
};

const selectHighlightedItem = () => {
  if (highlightedIndex.value >= 0 && menuItems.value[highlightedIndex.value]) {
    menuItems.value[highlightedIndex.value].click();
  }
};

const updateDropdownPosition = () => {
  if (!tb_action_container.value || !show.value) return;

  const buttonRect = tb_action_container.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const spacing = 2; // Gap between button and dropdown

  // Wait for dropdown to render to get its height
  nextTick(() => {
    if (tb_action_menu.value) {
      const dropdownRect = tb_action_menu.value.getBoundingClientRect();
      const dropdownHeight = dropdownRect.height;
      
      // Calculate space below and above button
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // Check if dropdown fits below
      const fitsBelow = spaceBelow >= dropdownHeight + spacing;
      const fitsAbove = spaceAbove >= dropdownHeight + spacing;
      
      // Decide position: prefer below, but use above if doesn't fit below
      if (fitsBelow || !fitsAbove) {
        // Position below button
        on_top.value = false;
        dropdownPosition.value = {
          top: buttonRect.bottom + spacing,
          left: buttonRect.right
        };
      } else {
        // Position above button
        on_top.value = true;
        dropdownPosition.value = {
          top: buttonRect.top - spacing,
          left: buttonRect.right
        };
      }
    }
  });
};

const handleKeydown = (e) => {
  if (!show.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openModal();
    }
    return;
  }

  const maxIndex = menuItems.value.length - 1;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (highlightedIndex.value < maxIndex) {
        highlightedIndex.value++;
      } else {
        highlightedIndex.value = 0;
      }
      updateHighlightVisual();
      scrollToHighlighted();
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      } else {
        highlightedIndex.value = maxIndex;
      }
      updateHighlightVisual();
      scrollToHighlighted();
      break;
      
    case 'Enter':
    case ' ':
      e.preventDefault();
      selectHighlightedItem();
      break;
      
    case 'Escape':
      e.preventDefault();
      closeModal();
      action_button.value?.focus();
      break;
      
    case 'Tab':
      e.preventDefault();
      if (e.shiftKey) {
        if (highlightedIndex.value > 0) {
          highlightedIndex.value--;
        } else {
          highlightedIndex.value = maxIndex;
        }
      } else {
        if (highlightedIndex.value < maxIndex) {
          highlightedIndex.value++;
        } else {
          highlightedIndex.value = 0;
        }
      }
      updateHighlightVisual();
      scrollToHighlighted();
      break;

    case 'Home':
      e.preventDefault();
      highlightedIndex.value = 0;
      updateHighlightVisual();
      scrollToHighlighted();
      break;

    case 'End':
      e.preventDefault();
      highlightedIndex.value = maxIndex;
      updateHighlightVisual();
      scrollToHighlighted();
      break;
  }
};

const handleScroll = () => {
  closeModal();
};

const handleResize = () => {
  updateDropdownPosition();
};

const openModal = () => {
  show.value = true;
  
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);

  nextTick(() => {
    updateDropdownPosition();
    updateMenuItems();
    highlightedIndex.value = -1;
    updateHighlightVisual();
    scrollToHighlighted();
  });

  emit("openModal")
};

const closeModal = () => {
  show.value = false;
  on_top.value = false;
  highlightedIndex.value = -1;
  
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  
  menuItems.value.forEach(item => {
    item.classList.remove('!bg-primary-500', '!text-base-white');
  });
  emit("closeModal")

};

const onSlotClick = (e) => {
  if (e.target !== e.currentTarget) {
    closeModal();
  }
};

const dropdownStyle = computed(() => {
  const style = {
    left: `${dropdownPosition.value.left}px`,
    transform: "translateX(-100%)"
  };
  
  if (on_top.value) {
    // Position above button
    style.bottom = `${window.innerHeight - dropdownPosition.value.top}px`;
  } else {
    // Position below button
    style.top = `${dropdownPosition.value.top}px`;
  }
  
  return style;
});

onMounted(async () => {
  const slots = useSlots();
  const slotContent = slots.default?.() ?? [];
  lengthMenu.value = slotContent.length;
});

watch(show, (newVal) => {
  if (newVal) {
    updateMenuItems();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.tb-action-button {
  @apply flex justify-center text-center items-center bg-primary-100 w-6 h-6 text-primary-500 border-transparent border rounded
}
.tb-action-button:disabled {
  @apply text-primary-300 bg-primary-100
}
.tb-action-button:hover {
  @apply text-primary-100 bg-primary-500
}
</style>