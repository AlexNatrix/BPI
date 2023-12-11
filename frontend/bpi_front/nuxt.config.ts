// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true
  },
  vite: {
    server: {
      watch: { usePolling: true },
      hmr: {
        host: 'localhost'
      }
    },

  },
  devtools: { enabled: true },
  css: ["@/style.css"],
});
