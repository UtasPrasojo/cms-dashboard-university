<template>
  <Teleport to="#app">
    <Transition name="modal-transition">
      <div v-if="modelValue" class="modal-container">
        <div class="modal-content lg:mr-[460px]" :class="position" :style="`max-width: ${maxWidth ?? '450px'}`">
          <div class="content-start w-full h-full overflow-hidden md:py-4">
            <!-- header -->
            <div class="flex items-center justify-between mb-4 px-4 md:px-6">
              <p class="text-sm md:text-xl font-bold"> {{ title }} </p>
              <button @click="$emit('update:modelValue', false); $emit('close')" class="flex-none w-8 h-8 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-base-light border">
                <i class="ri-close-line text-xs md:text-xl"></i>
              </button>
            </div>
            <div class="h-full overflow-auto px-4 md:px-6 py-1">
              <slot/>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script>
export default {
  props: ['modelValue', 'title', 'maxWidth', 'position'],
  emits: ['update:modelValue', 'close']
}
</script>
<style scoped>
.modal-container {
  @apply z-30 fixed top-0 left-0 grid justify-items-end w-screen h-screen bg-base-black/40 p-3 pr-0 md:pr-3 overflow-hidden;
}

.modal-content {
  @apply w-full h-full rounded-3xl rounded-r-none md:rounded-r-3xl bg-base-white overflow-hidden py-2;
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
  @apply translate-x-[10px];
}



</style>