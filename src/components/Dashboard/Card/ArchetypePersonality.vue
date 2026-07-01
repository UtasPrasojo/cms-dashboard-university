<template>
    <div class="bg-base-white p-4 rounded-3xl">
        <div class="flex justify-between items-center pb-4">
            <p>Archetype Personality</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" width="16" height="16" class="shrink-0 text-primary-900">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        </div>

        <div class="grid grid-cols-2">
            <!-- Kolom kiri -->
            <div class="flex flex-col  pr-6 ">
                <div v-for="(item, index) in leftArchetypes" :key="index"
                    class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                        <img :src="item.image" :alt="item.title" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="text-[14px] font-medium text-gray-900">{{ item.title }}</p>
                            <p class="text-[12px] italic text-gray-400">{{ item.traits }}</p>
                        </div>
                    </div>

                    <div class="bg-gray-100 rounded-full px-4 py-2">
                        <span class="text-[13px] font-medium text-gray-700">{{ item.percentage }}%</span>
                    </div>
                </div>
            </div>

            <!-- Garis pembatas tengah -->
            <div class="hidden md:block absolute "></div>

            <!-- Kolom kanan -->
            <div class="flex flex-col  md:border-l md:border-gray-100 md:pl-6">
                <div v-for="(item, index) in rightArchetypes" :key="index"
                    class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                        <img :src="item.image" :alt="item.title" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="text-[14px] font-medium text-gray-900">{{ item.title }}</p>
                            <p class="text-[12px] italic text-gray-400">{{ item.traits }}</p>
                        </div>
                    </div>

                    <div class="bg-gray-100 rounded-full px-4 py-2">
                        <span class="text-[13px] font-medium text-gray-700">{{ item.percentage }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Ant from '@/assets/images/archetype/3d/ant.svg'
import Cow from '@/assets/images/archetype/3d/cow.svg'
import Dog from '@/assets/images/archetype/3d/dog.svg'
import Dolphin from '@/assets/images/archetype/3d/dolphin.svg'
import Cat from '@/assets/images/archetype/3d/cat.svg'
import Owl from '@/assets/images/archetype/3d/owl.svg'
import Tiger from '@/assets/images/archetype/3d/tiger.svg'
import Wolf from '@/assets/images/archetype/3d/wolf.svg'

interface Archetype {
    title: string
    traits: string
    percentage: number
    image: string
}

// Data dummy - ganti path image sesuai file 3D avatar yang kamu punya di folder assets
const archetypes: Archetype[] = [
    {
        title: 'Strategist',
        traits: 'Visioner · Analitis · Bijaksana',
        percentage: 24,
        image: Owl,
    },
    {
        title: 'Executor',
        traits: 'Berorientasi Hasil · Disiplin · Tanggap',
        percentage: 20,
        image: Tiger,
    },
    {
        title: 'Organizer',
        traits: 'Terstruktur · Cermat · Sistematis',
        percentage: 17,
        image: Ant,
    },
    {
        title: 'Collaborator',
        traits: 'Empatik · Kolaboratif · Suportif',
        percentage: 14,
        image: Dolphin,
    },
    {
        title: 'Independent Thinker',
        traits: 'Mandiri · Kritis · Reflektif',
        percentage: 12,
        image: Cat,
    },
    {
        title: 'Adaptive Innovator',
        traits: 'Inovatif · Adaptif · Solutif',
        percentage: 7,
        image: Dog,
    },
    {
        title: 'Stabilizer',
        traits: 'Andal · Konsisten · Stabil',
        percentage: 4,
        image: Cow,
    },
    {
        title: 'Pathfinder',
        traits: 'Eksploratif · Terbuka · Dinamis',
        percentage: 2,
        image: Wolf,
    },
]

const leftArchetypes = computed(() => archetypes.slice(0, 4))
const rightArchetypes = computed(() => archetypes.slice(4, 8))
</script>