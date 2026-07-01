<template>
  <div>
    <TbTitle :title="title ?? `Data ${$type() == 'company' ? 'Karyawan' : 'Siswa'}`" :desc="desc ?? ''" :store="userStore" :size_list="[5,10,15,20,50, 1000000000]">
      <template #left>
        <p class="text-sm font-semibold text-primary-500" v-if="form.users.length != 0">{{ form.users.length }} {{ $type() == 'company' ? 'Karyawan' : 'siswa' }} Terpilih</p>
        <PartialBadgeTag type="information" size="large" :label="`Sisa kuota: ` + limit" v-if="limit != undefined" />
      </template>
      <template #center>
        <PresensiFilter @apply="applyFilter" @reset="resetFilter" @close="syncFilter" :filterActive="filterActive">
          <template v-if="$type() == 'company'">
              <InputDropdownV2 class="w-full" :label="null" v-model="filter.division_id" name="division" placeholder="Pilih Divisi"/>
              <InputDropdownV2 class="w-full" :label="null" v-model="filter.branch_id" name="branch" placeholder="Pilih Cabang"/>
            </template>
            <template v-else>
              <InputDropdownV2 class="w-full" :label="null" v-model="filter.level" name="level"  placeholder="Pilih Tingkat"/>
              <InputDropdownV2 class="w-full" :label="null" v-model="filter.class_id" name="class" placeholder="Pilih Kelas" :filterBy="{ level: filter.level }"/>
            </template>
        </PresensiFilter>
      </template>
    </TbTitle>
    <div class="max-h-[70vh] overflow-auto border rounded-lg">
      <TbMain class="border-none" v-if="userStore.users">
        <TbRow type="head">
          <TbHead class="w-[5%]"> 
            <InputCheck 
              :disabled="disabled || ((userStore.users.length > limit - form.users.length) && !allUserChecked)"  
              @click="selectAllUser()" 
              :checked="someUserChecked" 
              :indeterminate="indeterminate" /> 
          </TbHead>
          <TbHead :store="userStore" sort="id_number"> {{ $type() == 'company' ? 'No Karyawan' : 'NISN' }}</TbHead>
          <TbHead :store="userStore" sort="name">Nama </TbHead>
          <!-- <TbHead :store="userStore" sort="email">Email</TbHead> -->
          <TbHead :store="userStore" sort="division_name" v-if="$type() == 'company'"> Divisi </TbHead>
          <TbHead :store="userStore" sort="class_name" v-else> Kelas </TbHead>
          <TbHead :store="userStore" sort="branch_name" v-if="$type() == 'company'"> Cabang </TbHead>
        </TbRow>
        <!-- body -->
        <TbRow v-for="user in userStore.users" :key="user.id">
          <TbData> 
            <InputCheck @click="selectUser(user.id)" 
              :disabled="disabled || (form.users.length >= limit && !form.users.includes(user.id))" 
              :checked="form.users.includes(user.id)" /> 
          </TbData>
          <TbData> {{ user.id_number }} </TbData>
          <TbData> {{ user.name }} </TbData>
          <!-- <TbData> <p class="max-w-[200px] text-ellipsis overflow-hidden">{{ user.email }}</p> </TbData> -->
          <TbData v-if="$type() == 'company'"> {{ user.division_name ?? '-' }} </TbData>
          <TbData v-else> {{ user.class_name ?? '-' }} </TbData>
  
          <TbData v-if="$type() == 'company'"> {{ user.branch_name ?? '-' }} </TbData>
        </TbRow>
      </TbMain>
    </div>
    <TbPaginate :filter="userStore.filter"/>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/company/presensi/setting/user.store.js'
import { useAuthStore } from '@/stores/auth.store'

export default {
  props: ['form', 'desc', 'title', 'limit', 'disabled'],
  data() {
    return {
      userStore: useUserStore(),
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
    return this.userStore.users?.every(({ id }) => this.form.users.includes(id));
    },
    someUserChecked() {
      return this.form.users.length > 0;
    },
    indeterminate() {
      return this.someUserChecked && !this.allUserChecked;
    },
    filterActive() {
      return Object.values(this.filter).some((v) => Array.isArray(v) ? v.length > 0 : (v !== '' && v !== null))
    }
  },
  mounted() {
    this.resetFilter()
  },
  watch: {
    'userStore.filter': {
      handler() {
        if(!this.onFetch) { 
          this.onFetch = true 
          this.userStore.fetch().finally(() => { this.onFetch = false }); 
        }
      },
      deep: true,
      immediate: false 
    },
    "authStore.branch": {
      async handler(value) {
        this.userStore.filter.branch_id = value
        this.filter.branch_id = value
      },
      deep: true
    },
  },
  methods: {
    applyFilter() {
      this.userStore.filter.division_id = this.filter.division_id
      this.userStore.filter.branch_id = this.filter.branch_id
      this.userStore.filter.class_id = this.filter.class_id
      this.userStore.filter.page = 1
      this.userStore.filter.level = this.filter.level
      this.modal_filter = false
    },
    resetFilter() {
      this.filter.division_id = ''
      this.filter.branch_id = ''
      this.filter.class_id = ''
      this.filter.level = ''
      this.applyFilter()
    },
    syncFilter() {
      this.filter.division_id = this.userStore.filter.division_id ?? ''
      this.filter.branch_id = this.userStore.filter.branch_id ?? ''
      this.filter.class_id = this.userStore.filter.class_id ?? ''
      this.filter.level = this.userStore.filter.level ?? ''
    },
    selectUser(id) {
      let index = this.form.users.indexOf(id)
      index === -1 ? this.form.users.push(id) : this.form.users.splice(index, 1)
    },
    selectAllUser() {
      if (this.allUserChecked) {
        this.form.users = this.form.users.filter(id => !this.userStore.users.some(user => user.id === id));
      } else {
        this.form.users = this.form.users.concat(this.userStore.users.map(user => user.id).filter(id => !this.form.users.includes(id)));
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