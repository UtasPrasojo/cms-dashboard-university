<template>
  <div class="border rounded-3xl py-8 text-center">
    <img
      :class="['mx-auto h-[150px]', imgClass]"
      :src="imgSrc"
      alt="">
    <p :class="['font-bold text-lg', titleClass]"> {{ title }} </p>
    <p class="container-desc"> {{ desc }} </p>
  </div>
</template>

<script>
import EmptyTable from '@/assets/illustration-empty.svg';
import EmptyCard from '@/assets/illustration-no-data-cuate.svg';

export default {
  props: {
    title: {
      type: [String, Number],
      default: ''
    },
    desc: {
      type: [String, Number],
      default: ''
    },
    imgClass: {
      type: String,
      default: ''
    },
    titleClass: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'table',
      validator: (v) => ['table', 'card'].includes(v)
    },
  },
  computed: {
    imgSrc() {
      const variants = {
        table: EmptyTable,
        card: EmptyCard,
      }
      return variants[this.variant] || EmptyTable
    }
  }
}
</script>