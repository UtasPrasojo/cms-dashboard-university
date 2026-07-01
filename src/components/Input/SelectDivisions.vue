<template>
  <div>
    <TbTitle :title="title ?? `Data Divisi`" hide_size :desc="desc ?? ''" :store="store" :size_list="[5,10,15,20,50, 1000000000]">
      <template #left>
        <p class="text-sm font-semibold text-primary-500" v-if="form.scope_data.length != 0">{{ form.scope_data.length }} {{ $type() == 'company' ? 'Divisi' : 'Jurusan' }} Terpilih</p>
        <PartialBadgeTag type="information" size="large" :label="`Sisa kuota: ` + limit" v-if="limit != undefined" />
      </template>
    </TbTitle>
    <div class="max-h-[50vh] overflow-auto border rounded-lg">
      <TbMain class="border-none" v-if="store.divisions">
        <TbRow type="head">
          <TbHead class="w-[5%]"> 
            <InputCheck 
              :disabled="(store.divisions.length > limit - form.scope_data.length) && !allUserChecked"  
              @click="selectAllUser()" 
              :checked="someUserChecked" 
              :indeterminate="indeterminate" /> 
          </TbHead>
          <TbHead :store="store" sort="name">Nama </TbHead>
          <TbHead>Jumlah Karyawan</TbHead>
        </TbRow>
        <!-- body -->
        <TbRow v-for="division in store.divisions" :key="division.id">
          <TbData> 
            <InputCheck @click="selectUser(division.id)" 
              :disabled="form.scope_data.length >= limit && !form.scope_data.includes(division.id)" 
              :checked="form.scope_data.includes(division.id)" /> 
          </TbData>
          <TbData> {{ division.name }} </TbData>
          <TbData> {{ division?.total_users ?? '0' }} </TbData>
        </TbRow>
      </TbMain>
    </div>
  </div>
</template>

<script>
import { useDivisionStore } from '@/stores/company/presensi/setting/division.store.js'
import { useAuthStore } from '@/stores/auth.store'

export default {
  props: ['form', 'desc', 'title', 'limit'],
  data() {
    return {
      store: useDivisionStore(),
      authStore: useAuthStore(),
      modal_filter: false,
      filter: {
        division_id: '',
        branch_id: '',
        class_id: '',
        level: ''
      },
      onFetch: false
    }
  },
  computed: {
    allUserChecked() {
    return this.store.divisions?.every(({ id }) => this.form.scope_data.includes(id));
    },
    someUserChecked() {
      return this.form.scope_data.length > 0;
    },
    indeterminate() {
      return this.someUserChecked && !this.allUserChecked;
    },
    filterActive() {
      return this.filter.division_id != '' || this.filter.branch_id != '' || this.filter.class_id != '' || this.filter.level != ''
    }
  },
  mounted() {
    this.resetFilter()
  },
  watch: {
    'store.filter': {
      handler() {
        if(!this.onFetch) { 
          this.onFetch = true 
          this.store.fetch().finally(() => { this.onFetch = false }); 
        }
      },
      deep: true,
      immediate: false 
    },
    "authStore.branch": {
      async handler(value) {
        this.store.filter.branch_id = value
        this.filter.branch_id = value
      },
      deep: true
    },
  },
  methods: {
    applyFilter() {
      this.store.filter.division_id = this.filter.division_id
      this.store.filter.branch_id = this.filter.branch_id
      this.store.filter.class_id = this.filter.class_id
      this.store.filter.page = 1
      this.store.filter.level = this.filter.level
      this.modal_filter = false
    },
    resetFilter() {
      this.filter.division_id = ''
      this.filter.branch_id = ''
      this.filter.class_id = ''
      this.filter.level = ''
      this.applyFilter() 
    },
    selectUser(id) {
      let index = this.form.scope_data.indexOf(id)
      index === -1 ? this.form.scope_data.push(id) : this.form.scope_data.splice(index, 1)
    },
    selectAllUser() {
      if (this.allUserChecked) {
        this.form.scope_data = this.form.scope_data.filter(id => !this.store.divisions.some(division => division.id === id));
      } else {
        this.form.scope_data = this.form.scope_data.concat(this.store.divisions.map(division => division.id).filter(id => !this.form.scope_data.includes(id)));
      }
    },
  }
}
</script>

<style scoped>
  .filter { 
    @apply border py-2 px-3 text-xs md:text-sm rounded-lg flex justify-between gap-4
  }
  .filter-active {
    @apply bg-primary-50 border-primary-500 text-primary-500
  }
</style>