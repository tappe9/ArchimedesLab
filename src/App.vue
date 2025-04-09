<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8 neon-text">
      正<span class="text-accent-neon">{{ vertices }}</span>角形を作図する
    </h1>
    
    <div class="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1fr_2fr]">
      <!-- コントロールパネル -->
      <div class="glass-panel p-6 space-y-6">
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="block text-sm">頂点数</label>
            <span class="text-xs text-white/50">3～1000の整数</span>
          </div>
          <input
            type="number"
            v-model="vertices"
            min="3"
            max="1000"
            maxlength="4"
            @input="validateVertices"
            class="input-field w-full"
          />
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm">線の太さ</label>
          <input
            type="range"
            v-model="strokeWidth"
            min="1"
            max="10"
            class="w-full accent-accent-neon bg-white/5"
          />
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm">線の色</label>
          <input
            type="color"
            v-model="strokeColor"
            class="w-full h-10 input-field"
          />
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm">塗りの色</label>
          <input
            type="color"
            v-model="fillColor"
            class="w-full h-10 input-field"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm">回転アニメーション</label>
          <label class="toggle-switch">
            <input type="checkbox" v-model="autoRotate">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <!-- 描画エリア -->
      <div class="glass-panel p-6 aspect-square">
        <svg
          viewBox="-100 -100 200 200"
          class="w-full h-full"
        >
          <!-- 多角形 -->
          <polygon
            :points="polygonPoints"
            :stroke="strokeColor"
            :fill="fillColor"
            :stroke-width="strokeWidth"
            :class="['transition-all duration-300', {'animate-spin-slow': autoRotate}]"
          />

          <!-- 外接円 -->
          <circle
            r="90"
            cx="0"
            cy="0"
            fill="none"
            :stroke="strokeColor"
            stroke-opacity="0.2"
            stroke-dasharray="4 4"
            class="transition-all duration-300"
          />
          
          <!-- 内接円 -->
          <circle
            :r="innerRadius"
            cx="0"
            cy="0"
            fill="none"
            :stroke="strokeColor"
            stroke-opacity="0.2"
            stroke-dasharray="4 4"
            class="transition-all duration-300"
          />
          
          <!-- 放射状の補助線 -->
          <line
            v-for="point in vertexPoints"
            :key="point.angle"
            x1="0"
            y1="0"
            :x2="point.x"
            :y2="point.y"
            :stroke="strokeColor"
            stroke-opacity="0.15"
            stroke-dasharray="1 2"
            class="transition-all duration-300"
          />
          
          <!-- 頂点マーカー -->
          <circle
            v-for="point in vertexPoints"
            :key="point.angle"
            :cx="point.x"
            :cy="point.y"
            r="2"
            :fill="strokeColor"
            class="transition-all duration-300"
          />
          
          <!-- 中心点 -->
          <circle
            cx="0"
            cy="0"
            r="2"
            :fill="strokeColor"
            class="transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const vertices = ref(5)

const validateVertices = (e) => {
  // 4文字以上は入力できないように制限
  if (e.target.value.length > 4) {
    e.target.value = e.target.value.slice(0, 4)
    vertices.value = parseInt(e.target.value)
  }
  // 1000より大きい値は1000に制限
  if (parseInt(e.target.value) > 1000) {
    vertices.value = 1000
  }
}
const strokeWidth = ref(1)
const strokeColor = ref('#00fff7')
const fillColor = ref('#0a0a1f')
const autoRotate = ref(false)

const vertexPoints = computed(() => {
  const points = []
  const count = parseInt(vertices.value) || 3
  const radius = 90 // SVGビューポートに合わせる

  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    points.push({ x, y, angle })
  }

  return points
})

const polygonPoints = computed(() => {
  return vertexPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const innerRadius = computed(() => {
  const count = parseInt(vertices.value) || 3
  // 内接円の半径を計算（正多角形の性質より）
  return 90 * Math.cos(Math.PI / count)
})
</script>

<style>
input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.25rem;
}
</style>
