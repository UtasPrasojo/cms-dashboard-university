<template>
  <div
    class="relative flex flex-row min-h-[500px] justify-center items-center text-center gap-3 bg-primary-600 rounded-lg py-8 px-16 overflow-clip"
  >
    <div
      class="absolute w-full h-full bg-gradient-to-b from-primary-900 via-[#3B13B73B] to-primary-900/10"
    ></div>
    <img
      class="absolute w-full h-full"
      src="@/assets/images/jpf/frame/bg-hero.svg"
      alt=""
      draggable="false"
    />
    <div
      class="absolute inset-0 bg-repeat-round animate-spin-slow-custom"
    ></div>

    <div class="flex flex-col gap-4">
      <transition-group
        name="card-flip-side"
        tag="div"
        class="flex flex-col gap-4"
      >
        <div
          class="relative h-[100px] w-[56px] shadow-[4px_4px_12px_0px_#FFFFFF1F]"
          v-for="(arch, arch_index) in data?.slice(0, 4)"
          :key="arch?.icon ?? arch_index + 'a'"
        >
          <transition name="card-disabled" mode="out-in">
            <PartialArchetypeCardStatic
              :class="{
                'cursor-pointer hover:scale-110 transition-all duration-300':
                  selected_arch.some(
                    (item) => item && item.icon == arch.icon
                  ) == false,
              }"
              :key="
                arch?.icon +
                '-' +
                (selected_arch.some((item) => item && item?.icon == arch?.icon)
                  ? 'disabled'
                  : 'enabled')
              "
              @click="addCard(arch)"
              :type="arch?.type"
              :variant="arch?.icon"
              :title="arch?.name"
              :disabled="
                selected_arch.some((item) => item && item?.icon == arch?.icon)
              "
            />
          </transition>
        </div>
      </transition-group>
    </div>
    <div
      class="relative flex-1 flex flex-col gap-8 justify-center items-center"
    >
      <p class="font-bold text-2xl text-base-white">
        {{ title }}
      </p>
      <div
        ref="archetype-drop-area"
        class="flex flex-row gap-6 middle-cards-container"
      >
        <div
          v-for="(item, index) in selected_arch"
          :key="'slot-' + index"
          class="relative h-[220px] w-[124px] card-slot shadow-[4px_4px_12px_0px_#FFFFFF1F]"
        >
          <!-- Removed mode="out-in" for simultaneous transitions -->
          <transition name="card-flip-middle">
            <PartialArchetypeCardStatic
              class="cursor-pointer hover:scale-105 transition-all duration-300"
              v-if="item"
              :key="item?.icon"
              @click="removeCard(index)"
              :type="item?.type"
              :variant="item?.icon"
            />
            <PartialArchetypeCardStatic
              v-else
              :key="'empty-' + index"
              disabled
              variant="owl"
            />
          </transition>
        </div>
      </div>
      <p
        class="text-balance font-medium max-w-3xl italic text-sm text-base-white"
      >
        {{ description }}
      </p>
      <ButtonAlert :disabled="isFilled" @click="handleSubmit">
        Gabungkan kombinasi
      </ButtonAlert>
    </div>
    <div class="flex flex-col gap-4">
      <transition-group
        name="card-flip-side"
        tag="div"
        class="flex flex-col gap-4"
      >
        <div
          class="relative h-[100px] w-[56px] shadow-[4px_4px_12px_0px_#FFFFFF1F]"
          v-for="(arch, arch_index) in data?.slice(4, 8)"
          :key="arch?.icon ?? arch_index + 'b'"
        >
          <transition name="card-disabled" mode="out-in">
            <PartialArchetypeCardStatic
              :class="{
                'cursor-pointer hover:scale-110 transition-all duration-300':
                  selected_arch.some(
                    (item) => item && item?.icon == arch?.icon
                  ) == false,
              }"
              :key="
                arch.icon +
                '-' +
                (selected_arch.some((item) => item && item?.icon == arch?.icon)
                  ? 'disabled'
                  : 'enabled')
              "
              @click="addCard(arch)"
              :type="arch?.type"
              :variant="arch?.icon"
              :title="arch?.name"
              :disabled="
                selected_arch.some((item) => item && item?.icon == arch?.icon)
              "
            />
          </transition>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
const props = defineProps({
  data: {
    type: Object,
  },
  title: {
    type: String,
    default: "Pilih 3 dari 8 Kartu Archetype",
  },
  description: {
    type: String,
    default:
      "Silakan pilih 3 kartu archetype dengan klik kartu yang ingin anda tambahkan pada kombinasi. Untuk menghilangkan kartu yang terpilih, klik kembali pada kartu yang sudah terpilih di kotak kombinasi.",
  },
});

const emit = defineEmits(["submit"]);

const selected_arch = reactive([null, null, null]);

const addCard = (item) => {
  if (selected_arch.some((card) => card && card?.icon === item?.icon)) {
    return;
  }
  const emptyIndex = selected_arch.findIndex((slot) => slot === null);
  if (emptyIndex !== -1) {
    selected_arch[emptyIndex] = item;
  }
};

const removeCard = (index) => {
  if (selected_arch[index] !== null) {
    selected_arch[index] = null;
  }
};

const handleSubmit = () => {
  emit(
    "submit",
    selected_arch.map((res) => res.code)
  );
};

const isFilled = computed(() => {
  return selected_arch.some((res) => res == null);
});
</script>

<style scoped>
/* Base Flip animation for side cards */
.card-flip-side-enter-active,
.card-flip-side-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.card-flip-side-enter-from,
.card-flip-side-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}

.flex.flex-col.gap-4 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Specific styles for the middle cards container */
.middle-cards-container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  position: relative;
  perspective: 1000px;
}

/* Styles for each individual card slot in the middle */
.card-slot {
  position: relative;
  width: 124px;
  height: 220px;
  flex-shrink: 0;
  transform-style: preserve-3d;
}

/* Individual card flip animation for middle slots */
.card-flip-middle-enter-active {
  /* Enter animation - new card appears */
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    opacity 0.4s ease-out;
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2; /* Give entering card higher z-index */
}
.card-flip-middle-leave-active {
  /* Leave animation - old card disappears */
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    opacity 0.4s ease-out;
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1; /* Keep leaving card behind entering one */
}

.card-flip-middle-enter-from {
  transform: rotateY(-90deg) scale(0.8);
  opacity: 0;
}
.card-flip-middle-leave-to {
  transform: rotateY(90deg) scale(0.8);
  opacity: 0;
}

/* For individual card disabling/enabling animation */
.card-disabled-enter-active,
.card-disabled-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
.card-disabled-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.card-disabled-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes spin-slow-custom {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow-custom {
  animation: spin-slow-custom 120s linear infinite;
  transform-origin: center center;
}
</style>