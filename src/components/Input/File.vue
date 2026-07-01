<template>
  <div class="grid gap-1">
    <label class="font-medium text-sm text-text-500">
      {{ title }} 
      <span class="text-primary-500" v-if="!required">(Optional)</span>
      <span class="text-red-600" v-else>*</span>
    </label>

    <div class="relative group">
      <input @change="handleFileUpload" :accept="accept"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[2]" type="file" ref="fileInput">
      <div
        class="grid justify-items-center text-center border-2 overflow-hidden border-dashed border-border-300 rounded-2xl bg-base-light text-text-500 text-sm transition-colors"
        :class="{ 'border-red-500': error, 'group-hover:bg-primary-50': !error, 'px-4 py-2 xl:py-8 2xl:py-12': !filePreview }">
        <!-- Preview Area -->
        <div v-if="filePreview" class="relative w-full max-w-[200px] h-fit max-h-[250px] aspect-square">
          <div class="grid content-center justify-items-center w-full h-full" v-if="filePreview">
            <IconExtensionPdfLine class="w-[60px] h-[60px] mb-2" v-if="filePreview.type == 'application/pdf'"/>
            <IconExtensionImageLine class="w-[60px] h-[60px] mb-2" v-else/>

            <p class="font-semibold text-primary-500 text-xs mb-1">{{ filePreview.name }}</p>
            <p class="text-text-300 text-[10px]">{{ filePreview.type }} • {{ (filePreview.size / (1024)).toFixed(2) }} KB</p>
          </div>
        </div>
        <!-- Upload Placeholder -->
        <template v-else>
          <div class="flex items-center justify-center p-1 rounded-full bg-primary-50">
            <IconUpload class="text-primary-500 h-9 w-9 flex-shrink-0" />
          </div>
          <div class="py-[10px]">
            <p class="text-primary-500 text-sm font-normal">Click to Upload</p>
            <span class="text-text-400 text-xs font-normal">(Max. File size: 5MB)</span>
          </div>
        </template>
        <!-- Error Message -->
        <p v-if="error" class="text-red-500 mt-1">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useHelperStore } from '@/stores/helper.store.js'
export default {
  props: {
    title: {
      type: String,
      default: 'Bukti'
    },
    type: {
      type: String,
      default: 'presensi'
    },
    required: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      store: useHelperStore(),
      filePreview: null,
      error: null,
      showPreview: false
    }
  },

  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.error = null

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB'
        this.resetInput()
        return
      }      
      // Store file and emit
      const res = await this.store.uploadImage(file, this.type)       
      if(res) {
        this.filePreview = file
        this.$emit('upload', res.url)
        this.$emit('file', res)
      } else {
        this.removeFile()
      }
    },

    removeFile() {
      this.filePreview = null
      this.error = null
      this.resetInput()
      this.$emit('upload', null)
    },

    resetInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>