<template>
    <!-- button -->
    <button type="button" title="Pulihkan" @click="noConfirm ? submit() : is_show = true" :type="type" :class="props.classButton" class="bg-primary-100 w-6 h-6 text-primary-500 hover:text-primary-100 border-primary-500 border rounded-[4px] hover:bg-primary-500">
      <i class="ri-arrow-go-back-fill"></i> Undo
    </button>
  
    <!-- modal -->
    <teleport to='#app' >
      <div class="grid justify-items-center content-center fixed top-0 left-0 z-50 w-screen h-screen bg-base-black/40 p-5" v-if="is_show">
      <div class="rounded-lg max-w-[500px] px-5 py-7 bg-base-white text-left text-black">
        <p class="font-bold text-2xl"> {{ title ?? 'Hapus Jadwal?' }} </p>
        <hr class="my-6">
        <p class="text-sm mb-7"> <span v-html="desc"></span> </p>
        <div class="flex gap-3 w-full">
          <button  @click="is_show = false" class="w-full px-5 py-[10px] leading-7 rounded-[10px] text-sm font-semibold transition-all hover:scale-[.98] border border-black">
            Batalkan
          </button>
          <button @click="submit()" class="w-full px-5 py-[10px] leading-7 rounded-[10px] text-sm font-semibold transition-all hover:scale-[.98] bg-gradient-to-r from-[#663BCB] to-[#7A3BCB] text-base-white">Ya, kembalikan</button>
        </div>
      </div>
    </div>
    </teleport>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    'title':{
      type: String,
      default: ''
    },
    'desc':{
      type: String,
      default: ''
    },
    'noConfirm':{
      type: Boolean,
      default: false
    },
    'type':{
      type: String,
      default: 'button'
    },
    'classButton':{
      type: String,
      default: ''
    },
    'classIcon':{
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['onConfirmed'])
  const is_show = ref(false)
  
  const submit = (() => {
    emit('onConfirmed')
    is_show.value = false
  })
  </script>