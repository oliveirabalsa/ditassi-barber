<template>
  <div class="container mx-auto py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Our Services</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-12">
        Choose from our range of professional haircuts and styling services, all delivered with expert precision.
      </p>
      
      <div v-if="servicesStore.loading" class="flex justify-center py-10">
        <div class="flex items-center gap-2">
          <Loader2 class="h-5 w-5 animate-spin" />
          <span>Loading services...</span>
        </div>
      </div>
      
      <div v-else-if="servicesStore.error" class="bg-destructive/10 text-destructive p-4 rounded-md">
        {{ servicesStore.error }}
      </div>
      
      <div v-else class="space-y-8">
        <Card 
          v-for="service in servicesStore.activeServices" 
          :key="service.id"
          class="overflow-hidden transition hover:shadow-md"
        >
          <div class="md:flex">
            <div class="md:w-1/3 bg-gray-100 dark:bg-gray-800 aspect-video md:aspect-auto">
              <div v-if="service.image_url" class="h-full w-full">
                <img 
                  :src="service.image_url" 
                  :alt="service.name"
                  class="h-full w-full object-cover"
                />
              </div>
              <div v-else class="h-full w-full flex items-center justify-center">
                <Scissors class="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <CardContent class="p-6 md:w-2/3">
              <div class="flex justify-between items-start">
                <div>
                  <h2 class="text-xl font-bold mb-2">{{ service.name }}</h2>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">{{ service.description }}</p>
                </div>
                
                <div class="text-right">
                  <div class="text-xl font-bold">${{ formatPrice(service.price_cents) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end mt-1">
                    <Clock class="h-4 w-4 mr-1" />
                    <span>{{ service.duration_minutes }} min</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <Button asChild>
                  <NuxtLink :to="`/book?service=${service.id}`">Book Now</NuxtLink>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Scissors, Clock } from 'lucide-vue-next'
import { useServicesStore } from '~/stores/services'

definePageMeta({
  layout: 'default'
})

const servicesStore = useServicesStore()

onMounted(async () => {
  if (servicesStore.services.length === 0) {
    await servicesStore.fetchServices()
  }
})

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}
</script>