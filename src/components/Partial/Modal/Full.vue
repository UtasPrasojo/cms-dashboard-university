<template>
  <Teleport to="#app">
    <Transition name="modal-transition">
      <div v-if="modelValue" class="modal-container" @click.self="handleCloseBackground"
        :class="{ centered }">
        <div :class="[containerClass, 'modal-content']">
          <div class="content-start w-full h-full overflow-hidden md:py-4 flex flex-col">
            <!-- header -->
            <div class="flex items-center justify-between mb-4 px-4 md:px-6">
              <div class="flex flex-col" v-if="title">
                <p class="text-sm md:text-xl font-bold text-text-500"> {{ title }} </p>
                <p class="container-desc mt-1" v-if="desc"> {{ desc }} </p>
              </div>
              <div class="flex flex-row gap-3">
                <InputDropdown v-if="store" :label="null" name="size" id="size" :options="sizeList.map(size => ({ label: size == 1000000000 ? 'All' : size, value: size }))" @selected="res => updateSize(res)" class="min-w-[70px]" placeholder="5" v-model="store.filter.size"/>
                <button @click="$emit('update:modelValue', false); $emit('close')"
                  class="flex-none w-8 h-8 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-base-light border">
                  <i class="ri-close-line text-xs md:text-xl"></i>
                </button>
              </div>
            </div>
            <div class="h-[70vh] 2xl:h-[76vh] overflow-auto px-4 md:px-6 py-1 flex flex-col"
              :class="[modalBodyClass]">
              <slot />
            </div>
            <div class="flex mt-4 px-6 self-end">
              <slot name='footer' />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  props: {
    containerClass: { type: String, default: null },
    modelValue: { type: null, default: false },
    modalFlex: { type: Boolean, default: false },
    title: { type: String, default: null },
    desc: { type: String, default: null},
    maxWidth: { type: String, default: '450px' },
    bodyClass: { type: String, default: '' },
    centered: { type: Boolean, default: false },
    store: { type: [Object, Array], default: null },
    size_list: { type: Array, default: null },
    persistent: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'close'],
  computed: {
    modalBodyClass() { return this.bodyClass; },
    sizeList() {
      if(this.size_list) {
        return this.size_list
      } else {
        return [5, 10, 15, 20, 50, 100]
      }
    },
  },
  methods: {
    updateSize(size) {
      if(this.store) {
        this.store.filter.size = size.value
      }
    },
    handleCloseBackground() {
      if(this.persistent) return
      this.$emit('update:modelValue', false)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-container {
  @apply z-30 fixed top-0 left-0 flex items-end justify-center w-screen h-full bg-base-black/40 overflow-hidden;
}

.modal-content {
  @apply relative w-full max-w-full rounded-t-2xl md:rounded-t-3xl bg-base-white overflow-hidden;
  height: auto;
}

.modal-container.centered {
  @apply items-center justify-center;
}

/* Fade backdrop */
.modal-transition-enter-active,
.modal-transition-leave-active {
  transition: opacity 0.4s ease;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

/* Slide modal content */
.modal-transition-enter-active .modal-content,
.modal-transition-leave-active .modal-content {
  transition: transform 0.4s ease;
}

.modal-transition-enter-from .modal-content {
  transform: translateY(100%);
}

.modal-transition-enter-to .modal-content,
.modal-transition-leave-from .modal-content {
  transform: translateY(0);
}

.modal-transition-leave-to .modal-content {
  transform: translateY(100%);
}
</style>