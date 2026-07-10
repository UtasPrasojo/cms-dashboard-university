<template>
    <div class="bg-base-white p-4 rounded-3xl">
        <div class="flex justify-between items-center pb-4">
            <p>Archetype Personality</p>
            <IconDashboardArrow class="w-4 h-4" />
        </div>

        <div class="grid grid-cols-2">
            <div class="flex flex-col pr-6">
                <div v-for="(item, index) in leftArchetypes" :key="index"
                    class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                        <img :src="item.image" :alt="item.title" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="text-[14px] font-medium text-gray-900">{{ item.title }}</p>
                            <p class="text-[12px] italic text-gray-400 line-clamp-1">{{ item.traits }}</p>
                        </div>
                    </div>

                    <div class="bg-gray-100 rounded-full px-4 py-2">
                        <span class="text-[13px] font-medium text-gray-700">{{ item.percentage }}%</span>
                    </div>
                </div>
            </div>

            <div class="hidden md:block absolute"></div>

            <div class="flex flex-col md:border-l md:border-gray-100 md:pl-6">
                <div v-for="(item, index) in rightArchetypes" :key="index"
                    class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                        <img :src="item.image" :alt="item.title" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="text-[14px] font-medium text-gray-900">{{ item.title }}</p>
                            <p class="text-[12px] italic text-gray-400 line-clamp-1">{{ item.traits }}</p>
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
import type { ArchetypePersonality } from '@/stores/university/type/archetype_personality'

interface Archetype {
    title: string
    traits: string
    percentage: number
    image: string
}

const props = withDefaults(
    defineProps<{
        data?: ArchetypePersonality[] | null
    }>(),
    {
        data: null,
    }
)

// NOTE: API codes are wolf, cow, dolphin, ant, lynx, cheetah, fox, owl.
// You currently only have image assets for: ant, cow, dog, dolphin, cat, owl, tiger, wolf.
// lynx / cheetah / fox have no matching asset yet — falling back to the closest
// existing icon below. Swap these once the real 3D assets exist.
const imageByCode: Record<string, string> = {
    wolf: Wolf,
    cow: Cow,
    dolphin: Dolphin,
    ant: Ant,
    owl: Owl,
    lynx: Cat,     // fallback — no dedicated "lynx" asset yet
    cheetah: Tiger, // fallback — no dedicated "cheetah" asset yet
    fox: Dog,       // fallback — no dedicated "fox" asset yet
}

const dummyArchetypes: Archetype[] = [
    { title: 'Strategist', traits: 'Visioner · Analitis · Bijaksana', percentage: 24, image: Owl },
    { title: 'Executor', traits: 'Berorientasi Hasil · Disiplin · Tanggap', percentage: 20, image: Tiger },
    { title: 'Organizer', traits: 'Terstruktur · Cermat · Sistematis', percentage: 17, image: Ant },
    { title: 'Collaborator', traits: 'Empatik · Kolaboratif · Suportif', percentage: 14, image: Dolphin },
    { title: 'Independent Thinker', traits: 'Mandiri · Kritis · Reflektif', percentage: 12, image: Cat },
    { title: 'Adaptive Innovator', traits: 'Inovatif · Adaptif · Solutif', percentage: 7, image: Dog },
    { title: 'Stabilizer', traits: 'Andal · Konsisten · Stabil', percentage: 4, image: Cow },
    { title: 'Pathfinder', traits: 'Eksploratif · Terbuka · Dinamis', percentage: 2, image: Wolf },
]

const archetypes = computed<Archetype[]>(() => {
    if (!props.data || props.data.length === 0) {
        return dummyArchetypes
    }

    const totalSum = props.data.reduce((sum, item) => sum + Number(item.total), 0)

    return props.data.map((item) => ({
        title: item.name,
        traits: item.description,
        percentage: totalSum ? Math.round((Number(item.total) / totalSum) * 100) : 0,
        image: imageByCode[item.code] ?? Ant,
    }))
})

const leftArchetypes = computed(() => archetypes.value.slice(0, 4))
const rightArchetypes = computed(() => archetypes.value.slice(4, 8))
</script>