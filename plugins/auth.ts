export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialize auth store when the app starts
  const authStore = useAuthStore()
  await authStore.init()
})