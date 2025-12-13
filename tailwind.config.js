/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
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
        // Original colors
        'bg-core': '#FDF6F8',
        'bg-panel': '#FFFFFF',
        // 'primary': '#FF9FCD', // Overridden below
        // 'secondary': '#A0E9FF', // Overridden below
        'accent': '#FFF59D',
        // 'text-main': '#4A4A4A', // Overridden below
        'text-muted': '#9B9B9B',
        'border-color': '#F0E6EA',

        // New Design Colors
        "primary": "#ee2b5b",
        "primary-soft": "#ffeaef",
        "primary-hover": "#d61f4d",
        "secondary": "#A0E9FF",
        "background-light": "#fff5f7",
        "background-dark": "#221015",
        "text-dark": "#1b0d11",
        "text-light": "#fcf8f9",
        "text-main": "#1b0d11",
        "text-secondary": "#9a4c5f",
        "card-light": "rgba(255, 255, 255, 0.7)",
        "card-dark": "rgba(34, 16, 21, 0.7)",
        "card-bg": "#ffffff",
        "surface-light": "#ffffff",
        "faction-scissors": "#ffeef2",
      },
      fontFamily: {
        base: ['Noto Sans JP', 'sans-serif'],
        display: ['Spline Sans', 'Plus Jakarta Sans', 'Noto Sans JP', 'sans-serif'],
        rounded: ['Varela Round', 'sans-serif'],
        sans: ["Spline Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
        jp: ["Noto Sans JP", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem", 
        "2xl": "2.5rem",
        "3xl": "3.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(238, 43, 91, 0.15)',
        'glow': '0 0 20px rgba(238, 43, 91, 0.3)',
        "kawaii": "0 10px 30px -5px rgba(255, 158, 205, 0.2)",
        "kawaii-hover": "0 20px 40px -5px rgba(255, 158, 205, 0.3)",
        "inner-soft": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)",
        "card": "0 2px 10px rgba(0,0,0,0.03), 0 0 0 1px rgba(243, 231, 234, 0.8)",
      },
      borderColor: {
        DEFAULT: '#F0E6EA',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
