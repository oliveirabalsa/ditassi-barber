// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'shadcn-nuxt'
  ],
  
  app: {
    head: {
      title: 'BarberBook - Single Chair Booking',
      meta: [
        { name: 'description', content: 'Book your next haircut with our single-chair barber shop' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' }
      ]
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  supabase: {
    redirect: false,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  
  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate'
    ]
  },
  
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  }
})