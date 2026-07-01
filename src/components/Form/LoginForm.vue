<template>
    <div>
        <div>
            <img src="@/assets/images/auth/icon-education.svg" alt="">
            <p class="text-[24px]">Masuk ke Dashboard Universitas</p>
            <p class="text-[14px] text-[#6E6E6E]">Masukkan email dan password</p>
        </div>
        <div class="flex flex-col gap-4">
            <InputText name="email" :required="true" label="Email" placeholder="Masukan alamat email anda..."
                :disabled="true" v-model="form.email" />
            <InputPassword name="password" :required="true" label="Password" placeholder="Masukan password anda..."
                :disabled="true" v-model="form.password" />

        </div>
        <div class="mt-6">
            <ButtonPrimary class="w-full"> Masuk </ButtonPrimary>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
interface LoginForm {
    email: string
    password: string
}

const form = reactive<LoginForm>({
    email: '',
    password: '',
})
</script>