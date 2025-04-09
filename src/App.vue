<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Tips Button -->
    <button
      @click="showTips = true"
      class="fixed top-4 right-4 glass-panel px-3 py-2 flex items-center gap-2 hover:border-accent-neon transition-colors z-10"
    >
      <span class="text-lg">ℹ️</span>
      <span class="text-sm">ヒント</span>
    </button>

    <!-- Tips Modal -->
    <div
      v-if="showTips"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-20"
    >
      <div class="glass-panel max-w-lg mx-4 p-6 relative">
        <button
          @click="showTips = false"
          class="absolute top-2 right-2 text-white/50 hover:text-white"
        >
          ✕
        </button>
        <h2 class="text-xl font-bold mb-4 neon-text">
          🧠 Archimedes Lab.って？
        </h2>
        <p class="text-white/80 leading-relaxed mb-4">
          このアプリは、古代ギリシャの数学者「アルキメデス」の考え方にインスパイアされたものです。
        </p>
        <p class="text-white/80 leading-relaxed mb-4">
          アルキメデスは、円に内接・外接する正多角形を使って、円周率（π）をとても正確に求めようとしました。
        </p>
        <p class="text-white/80 leading-relaxed">
          このアプリでは、アルキメデスと同じように、多角形の辺の数を増やしていくことで、πに近づいていく様子を体験できます。
        </p>
      </div>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold neon-text mb-2">Archimedes Lab.</h1>
      <p class="text-white/70">正多角形を作図する</p>
    </div>

    <div class="max-w-5xl mx-auto space-y-8">
      <!-- 描画エリアとπ情報 -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
        <!-- 描画エリア -->
        <div class="glass-panel p-6 aspect-square">
          <svg viewBox="-100 -100 200 200" class="w-full h-full">
            <!-- 多角形 -->
            <polygon
              :points="polygonPoints"
              :stroke="strokeColor"
              :fill="fillColor"
              :stroke-width="strokeWidth"
              :class="[
                'transition-all duration-300',
                { 'animate-spin-slow': autoRotate },
              ]"
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
              :stroke-width="guidelineWidth"
              class="transition-all duration-300"
            />

            <!-- 頂点マーカー -->
            <circle
              v-for="point in vertexPoints"
              :key="point.angle"
              :cx="point.x"
              :cy="point.y"
              :r="vertexSize"
              :fill="strokeColor"
              class="transition-all duration-300"
            />

            <!-- 中心点 -->
            <circle
              cx="0"
              cy="0"
              :r="vertexSize"
              :fill="strokeColor"
              class="transition-all duration-300"
            />
          </svg>
        </div>

          <!-- π情報パネル -->
        <div class="glass-panel p-4 md:w-64 h-fit">
          <div class="grid grid-cols-1 gap-2 text-sm">
            <div class="text-white/70 mb-1">半径 r = 1</div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span>周長（近似円周）</span>
                <button
                  class="help-icon"
                  @click="showTooltip('perimeter')"
                  title="正多角形のまわりの長さ。円の周の長さに近づいていくよ。"
                >
                  ？
                </button>
              </div>
              <span class="font-mono">{{ perimeter.toFixed(6) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span>πの近似値</span>
                <button
                  class="help-icon"
                  @click="showTooltip('pi')"
                  title="この図形から求められる、円周率（π）のだいたいの値だよ。"
                >
                  ？
                </button>
              </div>
              <span class="font-mono">{{ approximatedPi.toFixed(6) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span>誤差</span>
                <button
                  class="help-icon"
                  @click="showTooltip('error')"
                  title="この値が小さいほど、本当のπに近いということだよ。"
                >
                  ？
                </button>
              </div>
              <span class="font-mono">{{ piError }}</span>
            </div>
            <div
              class="flex justify-between items-center text-white/50 text-xs"
            >
              <div class="flex items-center gap-1">
                <span>実際のπ</span>
                <button
                  class="help-icon"
                  @click="showTooltip('realPi')"
                  title="本当の円周率（π）の値だよ。"
                >
                  ？
                </button>
              </div>
              <span class="font-mono">{{ Math.PI.toFixed(6) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- コントロールパネル -->
      <div class="glass-panel p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <!-- 頂点数 -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-sm">頂点数</label>
              <span class="text-xs text-white/50">3～1000</span>
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

          <!-- 線の太さ -->
          <div class="space-y-2">
            <label class="block text-sm">線の太さ</label>
            <input
              type="range"
              v-model="strokeWidth"
              min="0.1"
              max="5"
              step="0.1"
              class="w-full accent-accent-neon bg-white/5"
            />
            <div class="text-xs text-white/50 text-right">
              {{ strokeWidth }}px
            </div>
          </div>

          <!-- 頂点の大きさ -->
          <div class="space-y-2">
            <label class="block text-sm">頂点の大きさ</label>
            <input
              type="range"
              v-model="vertexSize"
              min="1"
              max="10"
              class="w-full accent-accent-neon bg-white/5"
            />
            <div class="text-xs text-white/50 text-right">
              {{ vertexSize }}px
            </div>
          </div>

          <!-- 補助線の太さ -->
          <div class="space-y-2">
            <label class="block text-sm">補助線の太さ</label>
            <input
              type="range"
              v-model="guidelineWidth"
              min="0.1"
              max="2"
              step="0.1"
              class="w-full accent-accent-neon bg-white/5"
            />
            <div class="text-xs text-white/50 text-right">
              {{ guidelineWidth }}px
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <!-- カラープリセット -->
          <div class="space-y-2 col-span-2">
            <label class="block text-sm">カラープリセット</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="preset in colorPresets"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="glass-panel p-2 text-sm hover:border-accent-neon transition-colors"
              >
                {{ preset.name }}
              </button>
            </div>
          </div>

          <!-- 色設定 -->
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

          <!-- 回転アニメーション -->
          <div
            class="col-span-2 md:col-span-4 flex items-center justify-center mt-4"
          >
            <label class="text-sm mr-4">回転アニメーション</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoRotate" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed bottom-4 w-full text-center text-white/50 text-sm">
      © 2025 Created by
      <a
        href="https://github.com/tappe9"
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent-neon hover:text-white transition-colors"
      >
        @tappe9
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

// ツールチップの説明テキスト
const tooltipTexts = {
  perimeter: "正多角形のまわりの長さ。円の周の長さに近づいていくよ。",
  pi: "この図形から求められる、円周率（π）のだいたいの値だよ。",
  error: "この値が小さいほど、本当のπに近いということだよ。",
  realPi: "本当の円周率（π）の値だよ。",
};

// ツールチップを表示する関数
const showTooltip = (key) => {
  toast.info(tooltipTexts[key], {
    position: "bottom-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Tipsモーダルの状態管理
const showTips = ref(false);

const vertices = ref(5);
const strokeWidth = ref(1);
const strokeColor = ref("#00fff7");
const fillColor = ref("#0a0a1f");
const autoRotate = ref(false);
const vertexSize = ref(2);
const guidelineWidth = ref(0.5);

// カラープリセット
const colorPresets = [
  { name: "サイバーパンク", stroke: "#00fff7", fill: "#0a0a1f" },
  { name: "レトロウェーブ", stroke: "#ff00ff", fill: "#120b1e" },
  { name: "マトリックス", stroke: "#00ff00", fill: "#0f0f0f" },
  { name: "クラシック", stroke: "#ffffff", fill: "#000000" },
];

const applyPreset = (preset) => {
  strokeColor.value = preset.stroke;
  fillColor.value = preset.fill;
};

const validateVertices = (e) => {
  // 4文字以上は入力できないように制限
  if (e.target.value.length > 4) {
    e.target.value = e.target.value.slice(0, 4);
    vertices.value = parseInt(e.target.value);
  }
  // 1000より大きい値は1000に制限
  if (parseInt(e.target.value) > 1000) {
    vertices.value = 1000;
  }
};

const vertexPoints = computed(() => {
  const points = [];
  const count = parseInt(vertices.value) || 3;
  const radius = 90; // SVGビューポートに合わせる

  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push({ x, y, angle });
  }

  return points;
});

const polygonPoints = computed(() => {
  return vertexPoints.value.map((p) => `${p.x},${p.y}`).join(" ");
});

const innerRadius = computed(() => {
  const count = parseInt(vertices.value) || 3;
  // 内接円の半径を計算（正多角形の性質より）
  return 90 * Math.cos(Math.PI / count);
});

// 正多角形の1辺の長さを計算（半径1の円に内接する正多角形）
const sideLength = computed(() => {
  const count = parseInt(vertices.value) || 3;
  const angle = (2 * Math.PI) / count;
  return 2 * Math.sin(angle / 2);
});

// 周長を計算
const perimeter = computed(() => {
  const count = parseInt(vertices.value) || 3;
  return sideLength.value * count;
});

// πの近似値を計算
const approximatedPi = computed(() => {
  return perimeter.value / 2;
});

// πとの誤差を計算
const piError = computed(() => {
  const error = Math.abs(Math.PI - approximatedPi.value);
  const sign = approximatedPi.value > Math.PI ? "+" : "";
  return `${sign}${error.toFixed(7)}`;
});
</script>

<style>
.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(0, 255, 247, 0.1);
  border: 1px solid rgba(0, 255, 247, 0.3);
  color: rgba(0, 255, 247, 0.8);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.help-icon:hover {
  background: rgba(0, 255, 247, 0.2);
  border-color: rgba(0, 255, 247, 0.5);
}

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
