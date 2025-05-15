<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition hover:shadow-md">
    <div class="aspect-video relative bg-gray-100 dark:bg-gray-700">
      <img 
        v-if="service.image_url" 
        :src="service.image_url" 
        :alt="service.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Scissors class="h-12 w-12 text-gray-400" />
      </div>
    </div>
    
    <div class="p-5">
      <h3 class="text-lg font-semibold mb-2">{{ service.name }}</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ service.description }}
      </p>
      
      <div class="flex justify-between items-center mb-4">
        <div>
          <p class="text-lg font-bold">${{ formatPrice(service.price_cents) }}</p>
        </div>
        <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Clock class="h-4 w-4 mr-1" />
          <span>{{ service.duration_minutes }} min</span>
        </div>
      </div>
      
      <Button class="w-full" @click="$emit('book')">Book Now</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Scissors, Clock } from 'lucide-vue-next'
import type { Service } from '~/stores/services'

const props = defineProps<{
  service: Service
}>()

const emit = defineEmits<{
  book: []
}>()

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}
</script>