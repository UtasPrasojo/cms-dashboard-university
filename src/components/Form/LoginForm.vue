<template>
    <form @submit.prevent="onSubmit">
        <div>
            <img src="@/assets/images/auth/icon-education.svg" alt="">
            <p class="text-[24px]">Masuk ke Dashboard Universitas</p>
            <p class="text-[14px] text-[#6E6E6E]">Masukkan email dan password</p>
        </div>
        <div class="flex flex-col gap-4">
            <InputText name="email" type="email" :required="true" label="Email" placeholder="Masukan alamat email anda..."
                v-model="form.email" />
            <InputPassword name="password" :required="true" label="Password" placeholder="Masukan password anda..."
                v-model="form.password" />

        </div>
        <div class="mt-6">
            <ButtonPrimary class="w-full" type="submit" :disabled="loading"> {{ loading ? 'Memproses...' : 'Masuk' }} </ButtonPrimary>
        </div>
    </form>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useHelperStore } from '@/stores/helper.store'
import { validate, createSchema, z } from '@/utils/validate'

interface LoginForm {
    email: string
    password: string
}

const router = useRouter()
const authStore = useAuthStore()
const helperStore = useHelperStore()

const form = reactive<LoginForm>({
    email: '',
    password: '',
})

const loading = ref(false)

const loginSchema = createSchema({
    email: z.email('Format email tidak valid').min(1, 'Email wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
})

async function onSubmit() {
    const result = validate(loginSchema, form)

    if (!result.success) {
        helperStore.form_error = Object.entries(result.errors).map(([item_name, message]) => ({
            item_name,
            message,
        }))
        return
    }

    helperStore.form_error = []
    loading.value = true

    try {
        await authStore.login({ username: form.email, password: form.password })
        if (authStore.user) {
            router.push(authStore.returnUrl ?? '/dashboard')
        }
    } finally {
        loading.value = false
    }
}
</script>
