/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
      colors: {
        'bg-core': '#FDF6F8', // 极浅粉白
        'bg-panel': '#FFFFFF', // 纯白
        'primary': '#FF9FCD', // 主色粉
        'secondary': '#A0E9FF', // 辅色蓝
        'accent': '#FFF59D', // 点缀黄
        'text-main': '#4A4A4A', // 深灰
        'text-muted': '#9B9B9B', // 浅灰
        'border-color': '#F0E6EA', // 浅粉灰
      },
      fontFamily: {
        base: ['Noto Sans JP', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'], // 保留一点科技感用于数字/Logo
        rounded: ['Varela Round', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#F0E6EA',
      }
    },
  },
  plugins: [],
}
