<template>
  <div class="flex flex-col items-center w-full">
    <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size">
      <!-- Grid circles -->
      <g>
        <circle
          v-for="(r, idx) in gridRadii"
          :key="`grid-${idx}`"
          :cx="center"
          :cy="center"
          :r="r"
          fill="none"
          stroke="#EEEEF5"
          stroke-width="1"
        />
      </g>

      <!-- Grid lines (axis) -->
      <g>
        <line
          v-for="(point, idx) in axisPoints"
          :key="`axis-${idx}`"
          :x1="center"
          :y1="center"
          :x2="point.x"
          :y2="point.y"
          stroke="#EEEEF5"
          stroke-width="1"
        />
      </g>

      <!-- Previous (dashed) rounded path -->
      <path
        v-if="previousData"
        :d="previousPathD"
        fill="rgba(150,150,150,0.05)"
        stroke="#9CA3AF"
        stroke-width="1.5"
        stroke-dasharray="4 3"
        stroke-linejoin="round"
      />
      <circle
        v-for="(point, idx) in previousCurvePoints"
        :key="`prev-dot-${idx}`"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="white"
        stroke="#9CA3AF"
        stroke-width="1.5"
      />

      <!-- Current (solid) rounded path -->
      <path
        :d="currentPathD"
        fill="rgba(99,75,229,0.18)"
        stroke="#6B46F5"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <circle
        v-for="(point, idx) in currentCurvePoints"
        :key="`curr-dot-${idx}`"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="white"
        stroke="#6B46F5"
        stroke-width="2"
      />

      <!-- Labels (kategori) -->
      <text
        v-for="(label, idx) in labels"
        :key="`label-${idx}`"
        :x="labelPoints[idx].x"
        :y="labelPoints[idx].y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-base-black"
        font-size="12"
      >
        {{ label }}
      </text>

      <!-- Badge angka (current) -->
      <g v-for="(point, idx) in currentCurvePoints" :key="`badge-${idx}`">
        <g v-if="data[idx] !== null && data[idx] !== undefined">
          <rect
            :x="point.x + badgeOffsetX(idx) - 18"
            :y="point.y - 14"
            width="36"
            height="28"
            rx="14"
            ry="14"
            fill="#3A3A3A"
          />
          <text
            :x="point.x + badgeOffsetX(idx)"
            :y="point.y"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
            font-size="13"
            font-weight="600"
          >
            {{ data[idx] }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Legend -->
    <div class="flex items-center gap-6 mt-2">
      <div class="flex items-center gap-2">
        <span
          class="w-4 h-4 rounded bg-primary-200 border border-primary-500"
        ></span>
        <span class="text-sm text-base-black">{{ currentLabel }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="w-4 h-4 rounded border border-dashed border-gray-400 bg-gray-50"
        ></span>
        <span class="text-sm text-base-black">{{ previousLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Point {
  x: number;
  y: number;
}

interface Props {
  labels: string[];
  data: (number | null)[];
  previousData?: (number | null)[];
  max?: number;
  size?: number;
  currentLabel?: string;
  previousLabel?: string;
  cornerRadius?: number;
}

const props = withDefaults(defineProps<Props>(), {
  previousData: undefined,
  max: 100,
  size: 480,
  currentLabel: "Semester Ini",
  previousLabel: "Semester Lalu",
  cornerRadius: 18,
});

const center = computed(() => props.size / 2);
const radius = computed(() => props.size / 2 - 90); // padding utk label & badge

const gridRadii = computed(() => {
  const steps = 4;
  const arr: number[] = [];
  for (let i = 1; i <= steps; i++) {
    arr.push((radius.value / steps) * i);
  }
  return arr;
});

const angleStep = computed(() => (2 * Math.PI) / props.labels.length);

// titik di sudut tertentu (dimulai dari atas, searah jarum jam)
function getPoint(value: number, index: number): Point {
  const angle = index * angleStep.value - Math.PI / 2;
  const r = (value / props.max) * radius.value;
  return {
    x: center.value + r * Math.cos(angle),
    y: center.value + r * Math.sin(angle),
  };
}

const axisPoints = computed(() =>
  props.labels.map((_, idx) => getPoint(props.max, idx)),
);

const labelPoints = computed(() =>
  props.labels.map((_, idx) => {
    const angle = idx * angleStep.value - Math.PI / 2;
    const r = radius.value + 40;
    return {
      x: center.value + r * Math.cos(angle),
      y: center.value + r * Math.sin(angle),
    };
  }),
);

const currentPoints = computed(() =>
  props.data.map((val, idx) => getPoint(val ?? 0, idx)),
);

const previousPoints = computed(() =>
  props.previousData
    ? props.previousData.map((val, idx) => getPoint(val ?? 0, idx))
    : [],
);

// hitung titik puncak kurva sebenarnya (t=0.5 pada quadratic bezier)
// + sekaligus dipakai untuk membangun path
function buildRoundedPathData(points: Point[], cornerRadius: number) {
  const n = points.length;
  const curvePoints: Point[] = [];

  if (n < 3) {
    return { d: "", curvePoints: points };
  }

  const segments: string[] = [];
  let startPoint: Point | null = null;

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const toNext = { x: next.x - curr.x, y: next.y - curr.y };

    const distPrev = Math.hypot(toPrev.x, toPrev.y);
    const distNext = Math.hypot(toNext.x, toNext.y);

    const r = Math.min(cornerRadius, distPrev / 2, distNext / 2);

    const startCorner: Point = {
      x: curr.x + (toPrev.x / distPrev) * r,
      y: curr.y + (toPrev.y / distPrev) * r,
    };
    const endCorner: Point = {
      x: curr.x + (toNext.x / distNext) * r,
      y: curr.y + (toNext.y / distNext) * r,
    };

    // titik di tengah kurva (t=0.5): 0.25*start + 0.5*control + 0.25*end
    const apex: Point = {
      x: 0.25 * startCorner.x + 0.5 * curr.x + 0.25 * endCorner.x,
      y: 0.25 * startCorner.y + 0.5 * curr.y + 0.25 * endCorner.y,
    };
    curvePoints.push(apex);

    if (i === 0) {
      startPoint = startCorner;
      segments.push(`M ${startCorner.x} ${startCorner.y}`);
    } else {
      segments.push(`L ${startCorner.x} ${startCorner.y}`);
    }

    segments.push(`Q ${curr.x} ${curr.y} ${endCorner.x} ${endCorner.y}`);
  }

  if (startPoint) {
    segments.push(`L ${startPoint.x} ${startPoint.y}`);
  }
  segments.push("Z");

  return { d: segments.join(" "), curvePoints };
}

const currentPathResult = computed(() =>
  buildRoundedPathData(currentPoints.value, props.cornerRadius),
);
const previousPathResult = computed(() =>
  buildRoundedPathData(previousPoints.value, props.cornerRadius),
);

const currentPathD = computed(() => currentPathResult.value.d);
const previousPathD = computed(() => previousPathResult.value.d);

// dot sekarang dipasang di titik puncak kurva (sudah di tengah garis)
const currentCurvePoints = computed(() => currentPathResult.value.curvePoints);
const previousCurvePoints = computed(
  () => previousPathResult.value.curvePoints,
);

// geser badge sedikit ke arah luar supaya tidak menutupi garis
function badgeOffsetX(index: number): number {
  const angle = index * angleStep.value - Math.PI / 2;
  const dir = Math.cos(angle);
  if (Math.abs(dir) < 0.3) return 0;
  return dir > 0 ? 32 : -32;
}
</script>
