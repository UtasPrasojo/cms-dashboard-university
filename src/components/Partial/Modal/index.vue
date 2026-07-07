<template>
  <Teleport to="#app">
    <Transition @click.self="handleCloseBackground" name="modal-transition">
      <div v-if="modelValue" class="modal-container" :class="{ centered: centered }">
        <div class="modal-content" :class="position" :style="modalStyle">
          <div class="content-start w-full h-full min-h-0 overflow-hidden py-3"
            :class="modalFlex ? 'flex flex-col' : 'grid'">
            <!-- header -->
            <div class="flex justify-between mb-5 px-3">
              <div class="flex flex-col pt-1">
                <p class="text-sm md:text-base font-bold"> {{ title }} </p>
                <p class="container-desc mt-1 whitespace-break-spaces" v-if="desc"> {{ desc }} </p>
              </div>
              <button @click="$emit('update:modelValue', false); $emit('close')"
                class="flex-none w-[30px] h-[30px] rounded-lg bg-base-light border">
                <i class="ri-close-line text-sm"></i>
              </button>
            </div>
            <div class="h-full overflow-y-scroll overflow-x-hidden px-3 py-1"
              :class="[modalBodyClass, modalFlex ? 'flex flex-col' : 'grid']">
              <slot />
            </div>
            <div class="flex mt-3 px-3 self-end">
              <slot name='footer' />
            </div>
          </div>
        </div>
        <!-- <img class="fixed h-[15px] object-cover bottom-0 w-full md:hidden" src="@/assets/images/shading-modal.svg" alt=""> -->
      </div>
    </Transition>
  </Teleport>
</template>
<script>
export default {
  props: {
    position: {
      type: String,
      default: ''
    },
    modelValue: {
      type: null,
      default: false
    },
    modalFlex: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: '450px'
    },
    bodyClass: {
      type: String,
      default: ''
    },
    centered: {
      type: Boolean,
      default: false
    },
    desc: {
      type: String,
      default: null
    },
    containerClass: {
      type: String,
      default: ''
    },
    persistent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close'],
  computed: {
    modalStyle() {
      return {
        maxWidth: this.maxWidth,
      };
    },
    modalBodyClass() {
      return this.bodyClass
    }
  },
  methods: {
    handleCloseBackground() {
      if (this.persistent) return
      this.$emit('update:modelValue', false);
      this.$emit('close');
    }
  }
}
</script>
<style scoped>
.modal-container {
  @apply z-30 fixed top-0 left-0 grid content-end items-end justify-items-center w-screen h-full md:content-normal md:justify-items-end bg-base-black/40 md:p-3;
}

.modal-content {
  @apply relative w-full h-[70vh] md:h-full rounded-t-2xl md:rounded-2xl md:rounded-r-2xl bg-base-white overflow-hidden;
}

.modal-container.centered {
  @apply content-center items-center justify-items-center;
}

.modal-transition-enter-active,
.modal-content,
.modal-transition-leave-active {
  @apply transition-all duration-100 ease-in-out;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  @apply opacity-0;
}

.modal-transition-enter-from .modal-content,
.modal-transition-leave-to .modal-content {
  @apply translate-y-full md:translate-y-0 md:translate-x-[460px];
}
</style>