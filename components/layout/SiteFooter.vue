<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
    <div class="container mx-auto py-8 px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Scissors class="h-4 w-4 text-white" />
            </div>
            <span class="text-xl font-bold tracking-tight">BarberBook</span>
          </div>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Professional haircuts and styling in a relaxed environment.
            Book your next appointment online.
          </p>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Quick Links
          </h3>
          <div class="mt-4 space-y-2">
            <NuxtLink 
              v-for="item in quickLinks" 
              :key="item.path" 
              :to="item.path"
              class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-foreground"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Hours & Location
          </h3>
          <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Monday - Friday: 9am - 7pm</p>
            <p>Saturday: 9am - 5pm</p>
            <p>Sunday: Closed</p>
            <p class="pt-2">123 Main Street</p>
            <p>Anytown, CA 12345</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} BarberBook. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Scissors } from 'lucide-vue-next'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Book Now', path: '/book' },
  { name: 'Contact', path: '/contact' },
  { name: 'Sign In', path: '/auth/login' }
]
</script>