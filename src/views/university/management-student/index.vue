<template>
    <div class="relative min-h-screen overflow-hidden bg-[#F0F3FF]">

        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-4 left-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>

            <div class="absolute bottom-4 right-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>
        </div>

        <!-- Content Layer -->
        <div class="relative z-10 w-full flex flex-col gap-4 p-6">
         <h2 class="text-[21px]">Manajemen Mahasiswa</h2>

         <DashboardTableManagementStudent />
        </div>

    </div>
</template>