<template>
  <div class="container mx-auto py-12 px-4">
    <Card class="max-w-4xl mx-auto">
      <CardContent class="p-6 sm:p-8">
        <div class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Book Your Appointment</h1>
            <div class="hidden sm:block">
              <Steps :current-step="currentStep" :steps="steps" />
            </div>
          </div>
          
          <div class="block sm:hidden mb-6">
            <Steps :current-step="currentStep" :steps="steps" />
          </div>
        </div>
        
        <ServiceSelector
          v-if="currentStep === 0"
          :initial-service-id="initialServiceId"
          @next="onServiceSelected"
        />
        
        <DateSelector
          v-else-if="currentStep === 1"
          :service="bookingData.service!"
          @back="currentStep = 0"
          @next="onDateSelected"
        />
        
        <ClientInfoForm
          v-else-if="currentStep === 2"
          :initial-data="bookingData.clientInfo"
          @back="currentStep = 1"
          @next="onClientInfoSubmitted"
        />
        
        <BookingSummary
          v-else-if="currentStep === 3"
          :service="bookingData.service!"
          :start-time="bookingData.startTime!"
          :end-time="bookingData.endTime!"
          :client-info="bookingData.clientInfo!"
          @back="currentStep = 2"
          @complete="onBookingCompleted"
        />
        
        <BookingConfirmation
          v-else-if="currentStep === 4"
          :appointment-id="bookingData.appointmentId!"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/stores/services'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const initialServiceId = computed(() => route.query.service as string || null)

const steps = [
  { name: 'Service', description: 'Choose a service' },
  { name: 'Date & Time', description: 'Pick a date and time' },
  { name: 'Your Info', description: 'Enter your contact info' },
  { name: 'Review', description: 'Review and confirm' }
]

const currentStep = ref(0)

const bookingData = reactive({
  service: null as Service | null,
  startTime: null as string | null,
  endTime: null as string | null,
  clientInfo: null as {
    name: string
    email: string
    phone: string
    notes?: string
  } | null,
  appointmentId: null as string | null
})

const onServiceSelected = (service: Service) => {
  bookingData.service = service
  currentStep.value = 1
}

const onDateSelected = (date: Date, startTime: string, endTime: string) => {
  bookingData.startTime = startTime
  bookingData.endTime = endTime
  currentStep.value = 2
}

const onClientInfoSubmitted = (clientInfo: typeof bookingData.clientInfo) => {
  bookingData.clientInfo = clientInfo
  currentStep.value = 3
}

const onBookingCompleted = (appointmentId: string) => {
  bookingData.appointmentId = appointmentId
  currentStep.value = 4
}
</script>