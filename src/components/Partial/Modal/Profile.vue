<template>
  <Teleport to="#app">
    <Transition name="modal-transition" @click.self="handleCloseBackground">
      <div v-if="modelValue" class="modal-container">
        <div class="modal-content">
          <slot/>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script>
export default {
  props: {
    modelValue: {type: [String, Boolean], default: false},
    title: {type: String, default: null},
    persistent: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'close'],
  methods: {
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
  @apply fixed top-0 left-0 grid justify-items-end w-screen h-screen bg-base-black/40 p-3 overflow-hidden z-20;
}

.modal-content {
  @apply max-w-[400px] w-full h-full rounded-3xl bg-base-white overflow-hidden;
}
.modal-transition-enter-active, 
.modal-content,
.modal-transition-leave-active {
  @apply transition-all duration-500;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  @apply opacity-0;
}

.modal-transition-enter-from .modal-content,
.modal-transition-leave-to .modal-content {
  @apply translate-x-[460px];
}
</style>