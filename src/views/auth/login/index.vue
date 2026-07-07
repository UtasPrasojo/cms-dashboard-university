<template>
    <div
        class="relative min-h-screen overflow-hidden bg-base-white border border-border-200 rounded-[16px] flex flex-col items-center justify-between py-8">
        <div class="absolute top-4 left-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl"></div>

        <div class="absolute bottom-4 right-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
        </div>
        <div class="relative z-10">
            <img src="@/assets/images/logo.svg" alt="Logo" class="h-[41px] mx-auto" />
        </div>

        <div class="relative z-10 w-full max-w-md">
            <FormLoginForm />
        </div>
        

        <div class="relative z-10">
            <p class="text-[12px] text-center">
                © 2026 Jenjang - PT Jenjang Talenta Indonesia.
            </p>
        </div>
    </div>
</template>