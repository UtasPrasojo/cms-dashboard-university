<template>
  <div
    class="p-2 flex flex-row rounded-xl bg-base-white border border-border-primary w-fit mb-3"
  >
    <component
      v-for="item in options"
      :key="item.key"
      size="small"
      :is="activeKey === item.key ? ButtonPrimary : ButtonPrimaryText"
      @click="select(item.key)"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      <span class="font-semibold">{{ item.label }}</span>
    </component>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ButtonPrimary from "./Primary.vue";
import ButtonPrimaryText from "./PrimaryText.vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  useHash: {
    type: Boolean,
    default: false,
  },
});

const model = defineModel({ type: String, default: null });
const route = useRoute();
const router = useRouter();

const activeKey = computed(() => {
  if (props.useHash) {
    const hashKey = route.hash.slice(1);
    if (props.options.some((item) => item.key === hashKey)) return hashKey;
    return props.options[0]?.key;
  }
  return model.value ?? props.options[0]?.key;
});

const select = (key) => {
  model.value = key;
  if (props.useHash) {
    router.replace({ hash: `#${key}` });
  }
};

watch(
  () => route.hash,
  (hash) => {
    if (!props.useHash) return;
    const key = hash.slice(1);
    if (props.options.some((item) => item.key === key)) {
      model.value = key;
    }
  },
);

onMounted(() => {
  if (!props.useHash) return;
  if (!route.hash) {
    router.replace({ hash: `#${props.options[0]?.key}` });
  } else {
    const key = route.hash.slice(1);
    if (props.options.some((item) => item.key === key)) {
      model.value = key;
    }
  }
});
</script>
