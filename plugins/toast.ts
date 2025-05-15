export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('toast', {
    success(message: string) {
      console.log(`Success: ${message}`)
      // Here you would integrate toast library
    },
    error(message: string) {
      console.error(`Error: ${message}`)
      // Here you would integrate toast library
    },
    info(message: string) {
      console.info(`Info: ${message}`)
      // Here you would integrate toast library
    }
  })
})

declare module '#app' {
  interface NuxtApp {
    $toast: {
      success: (message: string) => void
      error: (message: string) => void
      info: (message: string) => void
    }
  }
}

// For Composition API
export const useToast = () => {
  return {
    success: (message: string) => useNuxtApp().$toast.success(message),
    error: (message: string) => useNuxtApp().$toast.error(message),
    info: (message: string) => useNuxtApp().$toast.info(message)
  }
}