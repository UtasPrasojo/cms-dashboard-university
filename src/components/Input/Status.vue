<template>
  <div class="grid justify-items-center gap-2 text-center">
    <div :class="style">
        {{ number }}
    </div>
    <p class="w-fit font-normal " :class="textStyle"> {{ name }} </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['name', 'status', 'number'])

const style = computed(() => {
  switch (props.status) {
    case 'active':
      return 'number-active text-blue-500 text-blue-500'
      break;
    case 'inactive':
      return 'number-inactive'
      break;
    case 'filled':
      return 'number-filled bg-blue-500 text-blue-500'
      break;
    default:
      break;
  }
})

const textStyle = computed(() => {
  switch (props.status) {
    case 'inactive':
      return 'text-[#ACACAC]'
      break;
    case 'active':
      return 'text-[#303030]'
      break;
    case 'filled':
      return 'text-blue-500'
      break;
    default:
      break;
  }
})
</script>

<style scoped>
.number-active {
  @apply flex flex-none justify-center items-center rounded-full font-semibold border   w-[50px] h-[50px] 
}
.number-inactive {
  @apply flex flex-none justify-center items-center rounded-full font-semibold border border-gray-300 text-gray-300 w-[50px] h-[50px] 
}
.number-filled {
  @apply flex flex-none justify-center items-center rounded-full font-semibold border  text-base-white w-[50px] h-[50px] 
}
</style>