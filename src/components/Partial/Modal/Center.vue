<template>
  <Teleport to="#app">
    <div v-if="modelValue" @click.self="handleCloseBackground" class="z-50 fixed left-0 top-0 grid justify-items-center content-center w-screen h-screen bg-base-black/40 px-10">
      <div class="flex flex-col  bg-base-white w-full h-full rounded-2xl min-h-[80vh] max-h-[95vh] overflow-hidden" :class="containerClass">
        <template v-if="!noHeader">
          <div class="flex justify-between items-center h-fit p-3">
            <div class="max-w-[60%]">
              <p class="text-sm font-bold text-text-500"> {{ title ?? 'title' }} </p>
              <p class="container-desc mt-1" v-if="desc"> {{ desc }} </p>
            </div>
            <button @click="$emit('update:modelValue', false); $emit('close')" class="flex justify-center items-center flex-none w-7 h-7 rounded-lg bg-base-light border">
              <i class="ri-close-line text-sm leading-none"></i>
            </button>
          </div>
          <hr class="my-4" v-if="!desc">
        </template>
        <div class="overflow-auto px-3 pb-3 h-full">
          <slot/>
        </div>
        <div class="p-3 border-t" v-if="!noFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script>
export default {
  props: {
    noFooter: { type: Boolean, default: false },
    modelValue: { type: [String, Boolean], default: false },
    title: { type: String, default: null },
    desc: { type: String, default: null },
    noHeader: { type: Boolean, default: false },
    containerClass: { type: [String, Array], default: null },
    persistent: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'close'],
  methods: {
    handleCloseBackground() {
      if(this.persistent) return
      this.$emit('update:modelValue', false)
    }
  }
}
</script>