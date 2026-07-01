<template>
  <div :class="['grid', label ? 'gap-1' : '']">
    <label v-if="label != null" :for="name" class="font-medium text-xs md:text-sm text-base-black" :class="customClass">
      {{ label }}<span class="text-error-600" v-if="required">*</span>
      <span class="text-primary-500 font-semibold" v-if="title_desc"> {{ title_desc ?? '' }} </span>
    </label>
    <p class="mb-2 text-xs text-gray-700" v-if="description"> {{ description }} </p>

    <div ref="select_trigger" :class="['relative w-full', { 'pointer-events-none': disabled, 'cursor-pointer': !open }]">
      <div class="relative select-default" :class="[
          open ? 'outline outline-2 outline-primary-500 ' : '',
          error ? 'border-red-500 bg-red-50/50' : 'bg-base-white',
          (!hideTag && selected_items.length > 0) ? 'py-1.5' : 'py-2',
          buttonClass
        ]"  @click="open = !open; error = false">
        <div class="flex justify-between w-full text-text-500" v-if="selected_items.length == 0 || hideTag">{{ placeholder }} <i class="ri-arrow-down-s-line"></i></div>
        <div class="flex w-full overflow-hidden" v-else>
          <div class="flex w-full gap-1 justify-between items-center">
            <div class="overflow-hidden">
              <PartialBadgeGroup :type="color" :items="selected_items_label" />
            </div>
            <i class="ri-arrow-down-s-line"></i>
          </div>
        </div>
        <input @invalid="handleInvalid()" :disabled="disabled" type="text" class="absolute h-full w-full input-style pointer-events-none" tabindex="-1" :required="required" :name="label" :value="selected_items_label">
      </div>

      <Teleport to="body">
      <template v-if="open">
        <div class="fixed top-0 left-0 w-screen h-screen bg-transparent z-40" @click="open = false" @wheel.passive="open = false"></div>
        <div :style="`width: ${$refs.select_trigger.clientWidth}px; top: ${$refs.select_trigger.getBoundingClientRect().bottom + 4}px; left: ${$refs.select_trigger.getBoundingClientRect().left}px`"
          class="flex fixed z-50 overflow-hidden max-h-[400px] elevation-6 border bg-base-white rounded-lg text-xs">
          <div class="flex flex-col overflow-auto gap-1 w-full">
            <!-- custom options -->
            <template v-if="options">
              <template v-for="item in options">
                <p v-if="typeof item == 'string'" class="text-start text-xs p-3 text-text-500 font-bold"> {{ item }} </p>
                <button v-else @click="selectItem(item.value)" class="flex gap-2 p-2  items-center hover:bg-primary-100" type="button">
                  <div class="flex-none flex items-center justify-center text-base-white w-5 h-5 border rounded-md"
                    :class="selected_items.includes(item.value) ? 'bg-primary-500 border-primary-500' : 'border-text-300 bg-base-white'">
                    <i class="ri-check-line"></i>
                  </div>
                  <div class="w-full">
                    <p class="text-start"> {{ item.label }} </p>
                    <p class="text-[10px] text-text-400 text-start" v-if="item.description" v-html="item.description"> </p>
                  </div>

                </button>
              </template>
              <p v-if="options.length == 0" class="text-start text-sm p-2 text-text-400">Tidak Ditemukan</p>
            </template>

            <!-- stored options -->
            <template v-else>
              <div class="p-1">
                <input name="search" class="w-full p-3 border text-xs border-primary-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent" 
                  type="text" placeholder="Pencarian ..." v-model="search_value" @keydown="inputDebounce()" :label="null" />
              </div>
              <button v-for="item in store.master_data[type]" @click="selectItem(item.value)" class="flex gap-2 p-2  items-center hover:bg-primary-100" type="button">
                <div class="flex-none flex items-center justify-center text-base-white w-5 h-5 border rounded-md"
                  :class="selected_items.includes(item.value) ? 'bg-primary-500 border-primary-500' : 'border-text-300 bg-base-white'">
                  <i class="ri-check-line"></i>
                </div>
                <p class="text-start"> {{ item.label }} </p>
              </button>
              <p v-if="store.master_data[type]?.length == 0"  class="flex items-center gap-1 text-start text-[11px] leading-3 p-2 text-text-400">
                <IconSearchEmpty class="flex-none" />
                <span>Pencarian tidak ditemukan</span>
              </p> 
            </template>
          </div>
        </div>
      </template>
      </Teleport>
    </div>
  </div>

</template>
<script>
import { useHelperStore } from '@/stores/helper.store.js'

export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String,
      default: null
    },
    modelValue: {
      default: []
    },
    customClass: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    title_desc: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'title'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: null
    },
    hideTag: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selected_items: [],
      open: false,
      store: useHelperStore(),
      error: false,
      search_value: '',
      timeout: null,
      master_data: []
    }
  },
  computed: {
    selected_items_label() {
      return this.selected_items.map((i) => {
        if(this.options) {
          return this.options.find((o) => o.value == i)?.label ?? ''
        } else {
          return this.master_data.find((o) => o.value == i)?.label ?? ''
        }
      })
    }
  },
  mounted() {
    if(this.type) {
      this.store.fetchMaster(this.type, '', false).then((res) => {
        this.master_data = res
      })
    }
  },
  watch: {
    'modelValue': {
      handler(value) {
        this.selected_items = value
      },
      deep: true,
      immediate:true
    }
  },
  methods: {
    inputDebounce() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.store.fetchMaster(this.type, this.search_value, false)
      }, 0)
    },
    handleInvalid() {
      this.$nextTick(() => {
        this.error = true
      })
    },
    selectItem(item) {
      if(this.selected_items.includes(item)) {
        this.selected_items = this.selected_items.filter((i) => i != item)
      } else {
        this.selected_items.unshift(item)
      }

      this.$emit('update:modelValue', this.selected_items)
      
    }
  }
}
</script>

<style scoped>
.select-default {
  @apply grid items-center appearance-none w-full rounded-lg border border-border-400 text-xs md:text-sm overflow-hidden px-3
}
.input-style {
  @apply appearance-none w-full h-full opacity-0 pointer-events-none
}
</style>