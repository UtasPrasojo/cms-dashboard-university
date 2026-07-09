<template>
    <div class="relative min-h-screen overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute bottom-4 right-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>
        </div>

        <!-- Content Layer -->
        <div class="relative z-10 w-full flex flex-col gap-4 p-6">
            <div class="flex items-end justify-between gap-4">
                <h2 class="text-[21px]">Program Studi</h2>
                <div class="flex-1">
                    <Breadcrumb :data="breadcrumbData" />
                </div>
            </div>

            <MasterDataTableMajor />
        </div>
    </div>
</template>

<script setup>
const breadcrumbData = [
    { name: 'Master Data' },
    { name: 'Program Studi' },
]
</script>
