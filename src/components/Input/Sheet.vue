<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="'upload-'+(label)+'sheet'" class="text-xs md:text-sm text-text-500 font-medium">
      {{ label }}<span v-if="required" class="text-error-600">*</span> 
    </label>
    <div :name="'upload-'+(label ?? '')+'sheet'" class="relative group">
      <div v-if="image" @click="removeFile()" class="rounded-lg p-2 bg-base-white absolute right-3 top-3 z-10 cursor-pointer hover:bg-gray-100 transition-colors">
        <i class="fi fi-rr-trash-xmark text-error-500"></i>
      </div>
      <input 
        :required="required"
        ref="fileInput"
        @change="uploadFile" 
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
        class="absolute top-0 w-full h-full opacity-0 cursor-pointer" 
        id="upload-user-list" 
        type="file"
      >
      <label for="upload-user-list" class="w-full cursor-pointer">
        <div class="flex flex-col justify-center items-center min-h-[235px] text-center px-5 py-4 border-2 border-dashed rounded-lg bg-surface-primary text-text-500 text-[11px] group-hover:bg-primary-50/100 transition-colors">
          <i v-if="!image" class="fi fi-rr-cloud-upload text-3xl text-border-400"></i>
          <div v-else class="px-4 py-3.5 rounded-lg bg-success-100 text-center h-fit">
            <i class="fi fi-rr-document text-success-500 text-base !leading-[0]"></i>
          </div>
          <p class="py-[10px]" v-if="!image">
            Seret dan letakkan file XLSX Anda di sini <br>
            <span class="text-text-400">atau klik untuk memilih file</span>
          </p>
          <p class="py-[10px] text-primary-500" v-else>{{ image.name }}</p>

          <p v-if="!image">Ukuran max : 5MB</p>
          <p v-else>Size file : {{ (image.size/1000).toFixed(2) }} KB</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: null,
    }
  },
  methods: {
    uploadFile(e) {
      const file = e.target.files[0]
      
      if (!file) {
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        alert('Ukuran file melebihi 5MB. Silakan pilih file yang lebih kecil.')
        this.resetFileInput()
        return
      }

      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      if (!validTypes.includes(file.type)) {
        alert('Format file tidak valid. Harap upload file Excel (.xlsx atau .xls)')
        this.resetFileInput()
        return
      }

      this.image = file
      this.$emit('upload', this.image)
      
      // Reset input to allow uploading the same file again
      this.resetFileInput()
    },
    
    removeFile() {
      this.image = null
      this.resetFileInput()
      this.$emit('upload', null)
    },
    
    resetFileInput() {
      // Reset the file input value to allow re-uploading the same file
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }
  }
}
</script>