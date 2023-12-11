// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
    },
  },
  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
      },
    },
  },
  devtools: { enabled: true },
  css: ["@/style.css"],
});
