// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    "@nuxt/image"
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  image: {
    domains: ['patchwiki.biligame.com'],
    format: ['webp', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

})
