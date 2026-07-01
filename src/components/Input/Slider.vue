<template>
  <div class="grid ">
    <div class="flex justify-between text-sm">
      <p class="font-bold text-sm"> {{ label }} </p>
      <p class="font-bold" v-if="desc"><span class="text-primary-500"> {{ desc }} </span></p>
      <p class="font-bold" v-else><span class="text-primary-500"> {{ modelValue ?? 0 }} </span>/ {{ max }}</p>
    </div>
    <div class="relative">
      <div class="flex gap-[2px] items-center w-full rounded-full">
        <div class="h-[10px] bg-primary-500 rounded-full" :style="`width: ${((modelValue)/max)*100}%`"></div>
        <div class="flex-none border-primary-500 border-[5px] rounded-full w-[18px] h-[18px] bg-primary-50"></div>
        <div class="h-[10px] rounded-full w-full bg-primary-50" :style="`width: ${((max - modelValue)/max)*100}%`"></div>
      </div>
      <input type="range" :disabled="disabled" :class="disabled ? 'pointer-events-none':''" class="absolute cursor-pointer top-0 opacity-0 w-full" min="0" :max="max" step="1" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  </div>
</template>
<script>
export default {

  props: ['modelValue', 'label', 'max', 'desc', 'disabled'],
  emits: ['update:modelValue']
}

</script>
<style scoped>
</style>