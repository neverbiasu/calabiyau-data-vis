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
    extend: {
      colors: {
        'bg-core': '#08090D',
        'bg-panel': '#12141C',
        'primary': '#00F0FF',
        'secondary': '#FF0055',
        'accent': '#FFE600',
        'text-main': '#EAEAEA',
        'text-muted': '#6B7280',
        'border-color': '#2A2F3E', // 'border' is a reserved keyword in some contexts, using border-color or just border-custom
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#2A2F3E',
      }
    },
  },
  plugins: [],
}
