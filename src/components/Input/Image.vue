<template>
  <div class="grid gap-1">
    <label class="font-medium text-xs text-text-500">
      {{ title }} <span class="text-red-600" v-if="required">*</span>
      <span class="text-primary-500" v-if="description"> {{ description }}</span>
    </label>

    <div class="relative group">
      <input @change="handleImageUpload" accept="image/*"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[2]" type="file" ref="fileInput">
      <div
        class="grid justify-items-center text-center border-2 overflow-hidden border-dashed border-border-300 rounded-lg bg-base-light text-text-500 text-sm transition-colors"
        :class="{ 'border-red-500': error, 'group-hover:bg-primary-50': !error, 'px-4 py-2 xl:py-8 2xl:py-12': !imagePreview }">
        <!-- Preview Area -->
        <div v-if="(preview && !img_error) || imagePreview" @click="removeImage()" class="rounded-lg p-2 bg-base-white absolute right-3 top-3 z-10">
          <i class="fi fi-rr-trash-xmark text-error-500"></i>
        </div>
        <div v-if="(preview && !img_error) || imagePreview" class="relative w-full max-w-[200px] max-h-[250px] aspect-square">
          <img :src="preview" @error="img_error = true" class="w-full h-full object-contain" alt="Preview" v-if="!img_error">
          <img :src="imagePreview" class="w-full h-full object-contain" alt="Preview" v-else>
        </div>

        <!-- Upload Placeholder -->
        <template v-else>
          <div class="flex flex-col py-3">
            <i class="fi fi-rr-cloud-upload text-3xl text-border-400"></i>
            <div class="py-[10px] text-[11px] flex flex-col gap-3 leading-none">
              <p class="font-normal flex flex-col text-text-secondary">
                <span>Seret dan letakkan file Image Anda disini,</span> 
                <span>atau klik untuk memilih file</span>
              </p>
              <span class="font-normal text-text-secondary">Ukuran max : 5MB</span>
            </div>
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
    preview: {
      type: String,
      default: null
    },
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
    description: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      store: useHelperStore(),
      selectedFile: null,
      img_error: false,
      imagePreview: null,
      error: null,
      showPreview: false
    }
  },
  watch: {
    preview(newVal) {
      if (newVal) {
        this.img_error = false
      }
    }
  },
  methods: {
    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.error = null

      // Validate file type
      if (!file.type.startsWith('image/') || file.type.startsWith('image/gif') ) {
        this.error = 'Please upload an image file'
        this.resetInput()
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB'
        this.resetInput()
        return
      }      
      // Create preview
      this.createImagePreview(file)

      // Store file and emit
      this.selectedFile = file
      const res = await this.store.uploadImage(file, this.type)
      if(res) {
        this.$emit('upload', res.url)
        this.$emit('file', res)
      }
    },
    
    createImagePreview(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    removeImage() {
      this.selectedFile = null
      this.imagePreview = null
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