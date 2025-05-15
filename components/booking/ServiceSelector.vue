<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Choose a Service</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="flex items-center gap-2">
        <Loader2 class="h-5 w-5 animate-spin" />
        <span>Loading services...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="bg-destructive/10 text-destructive p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card 
        v-for="service in services" 
        :key="service.id"
        :class="[
          'cursor-pointer transition-all',
          selectedService?.id === service.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
        ]"
        @click="selectService(service)"
      >
        <CardContent class="p-6">
          <div class="flex justify-between">
            <div>
              <h3 class="font-semibold text-lg">{{ service.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ service.description }}</p>
            </div>
            <div class="flex flex-col items-end">
              <span class="font-bold">${{ formatPrice(service.price_cents) }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ service.duration_minutes }} min
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div class="mt-8 flex justify-between">
      <div></div>
      <Button 
        :disabled="!selectedService"
        @click="$emit('next', selectedService)"
      >
        Continue
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useServicesStore, type Service } from '~/stores/services'

const servicesStore = useServicesStore()
const services = computed(() => servicesStore.activeServices)
const loading = computed(() => servicesStore.loading)
const error = computed(() => servicesStore.error)

const selectedService = ref<Service | null>(null)

const props = defineProps({
  initialServiceId: {
    type: String,
    default: null
  }
})

const emit = defineEmits<{
  next: [service: Service]
}>()

onMounted(async () => {
  if (servicesStore.services.length === 0) {
    await servicesStore.fetchServices()
  }
  
  // If initialServiceId is provided, select that service
  if (props.initialServiceId && servicesStore.services.length > 0) {
    const service = servicesStore.getServiceById(props.initialServiceId)
    if (service) {
      selectedService.value = service
    }
  }
})

const selectService = (service: Service) => {
  selectedService.value = service
}

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}
</script>