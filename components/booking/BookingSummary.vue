<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Booking Summary</h2>
    
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Service</h3>
          <p class="font-medium">{{ service.name }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ service.duration_minutes }} min | ${{ formatPrice(service.price_cents) }}
          </p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</h3>
          <p class="font-medium">{{ formatDateLong(new Date(startTime)) }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ formatTime(new Date(startTime)) }} - {{ formatTime(new Date(endTime)) }}
          </p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</h3>
          <p class="font-medium">{{ clientInfo.name }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ clientInfo.email }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ clientInfo.phone }}
          </p>
        </div>
        
        <div v-if="clientInfo.notes">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ clientInfo.notes }}
          </p>
        </div>
      </div>
    </div>
    
    <Alert v-if="error" class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>
    
    <div class="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        @click="$emit('back')"
        :disabled="isSubmitting"
      >
        Back
      </Button>
      <Button 
        type="button" 
        @click="confirmBooking"
        :disabled="isSubmitting"
      >
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Confirm Booking
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import type { Service } from '~/stores/services'
import { useAppointmentsStore } from '~/stores/appointments'

const appointmentsStore = useAppointmentsStore()
const router = useRouter()
const supabase = useSupabaseClient()

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const props = defineProps<{
  service: Service
  startTime: string
  endTime: string
  clientInfo: {
    name: string
    email: string
    phone: string
    notes?: string
  }
}>()

const emit = defineEmits<{
  back: []
  complete: [appointmentId: string]
}>()

// Format time (e.g., "10:00 AM")
const formatTime = (date: Date) => {
  return format(date, 'h:mm a')
}

// Format date for display (e.g., "Monday, January 1, 2023")
const formatDateLong = (date: Date) => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

// Format price from cents to dollars
const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}

const confirmBooking = async () => {
  isSubmitting.value = true
  error.value = null
  
  try {
    // Get barber ID (assuming there's only one barber for now)
    const { data: barbers } = await supabase
      .from('barbers')
      .select('id')
      .limit(1)
      .single()
    
    if (!barbers) {
      throw new Error('No barber found')
    }
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // If no user, we need to create a client record for a guest
    let clientId: string
    
    if (!user) {
      // Check if a client with this email already exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', props.clientInfo.email)
        .limit(1)
        .single()
      
      if (existingClient) {
        // Use existing client
        clientId = existingClient.id
      } else {
        // Create new client
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            id: crypto.randomUUID(),
            name: props.clientInfo.name,
            email: props.clientInfo.email,
            phone: props.clientInfo.phone
          })
          .select('id')
          .single()
        
        if (clientError) throw clientError
        
        clientId = newClient.id
      }
    } else {
      // Use authenticated user's ID
      clientId = user.id
      
      // Make sure client record exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('id', user.id)
        .limit(1)
        .single()
      
      if (!existingClient) {
        // Create client record
        await supabase
          .from('clients')
          .insert({
            id: user.id,
            name: props.clientInfo.name || user.user_metadata?.name || '',
            email: user.email || props.clientInfo.email,
            phone: props.clientInfo.phone
          })
      }
    }
    
    // Create appointment
    const appointment = {
      client_id: clientId,
      service_id: props.service.id,
      barber_id: barbers.id,
      starts_at: props.startTime,
      ends_at: props.endTime,
      status: 'confirmed',
      notes: props.clientInfo.notes
    }
    
    const result = await appointmentsStore.createAppointment(appointment)
    
    emit('complete', result.id)
  } catch (err) {
    console.error('Error creating appointment:', err)
    error.value = err instanceof Error ? err.message : 'Failed to create appointment'
  } finally {
    isSubmitting.value = false
  }
}
</script>