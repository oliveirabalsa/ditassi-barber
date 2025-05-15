export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Make sure auth is initialized
  if (authStore.loading) {
    await until(() => !authStore.loading).toMatch(false)
  }
  
  // Check if user is authenticated
  if (!authStore.user) {
    return navigateTo('/auth/login')
  }
})