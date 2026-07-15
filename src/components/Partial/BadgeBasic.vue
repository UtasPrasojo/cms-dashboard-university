<template>
    <span
        class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary-100 text-primary-600 text-[10px] font-semibold leading-none">
        {{ label }}
    </span>
</template>

<script setup>
defineProps({
    label: { type: [String, Number], default: '0' },
})
</script>
