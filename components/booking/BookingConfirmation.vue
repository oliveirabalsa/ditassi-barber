<template>
  <div class="text-center py-8">
    <div class="mb-6 flex justify-center">
      <div class="h-16 w-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
        <CheckIcon class="h-8 w-8 text-green-600 dark:text-green-300" />
      </div>
    </div>
    
    <h2 class="text-2xl font-bold mb-4">Booking Confirmed!</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      Your appointment has been successfully scheduled. We've sent a confirmation to your email.
    </p>
    
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 max-w-md mx-auto text-left">
      <div v-if="appointment" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Service</h3>
          <p class="font-medium">{{ appointment.services.name }}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</h3>
          <p class="font-medium">{{ formatDateLong(new Date(appointment.starts_at)) }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ formatTime(new Date(appointment.starts_at)) }} - {{ formatTime(new Date(appointment.ends_at)) }}
          </p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
          <p class="font-medium">123 Main Street</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Anytown, CA 12345
          </p>
        </div>
      </div>
      
      <div v-else class="flex justify-center py-4">
        <Loader2 class="h-6 w-6 animate-spin text-primary" />
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button variant="outline" asChild>
        <NuxtLink to="/">Return Home</NuxtLink>
      </Button>
      
      <Button v-if="!user" asChild>
        <NuxtLink to="/auth/register">Create an Account</NuxtLink>
      </Button>
      
      <Button v-else-if="isAdmin" asChild>
        <NuxtLink to="/admin/appointments">View Dashboard</NuxtLink>
      </Button>
      
      <Button v-else asChild>
        <NuxtLink to="/account/appointments">View My Appointments</NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { Check as CheckIcon, Loader2 } from 'lucide-vue-next'
import { useAppointmentsStore, type AppointmentWithDetails } from '~/stores/appointments'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  appointmentId: string
}>()

const appointmentsStore = useAppointmentsStore()
const authStore = useAuthStore()
const supabase = useSupabaseClient()

const appointment = ref<AppointmentWithDetails | null>(null)
const loading = ref(true)
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

// Format time (e.g., "10:00 AM")
const formatTime = (date: Date) => {
  return format(date, 'h:mm a')
}

// Format date for display (e.g., "Monday, January 1, 2023")
const formatDateLong = (date: Date) => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

// Fetch appointment details
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (
          name,
          duration_minutes,
          price_cents
        ),
        clients (
          name,
          email,
          phone
        )
      `)
      .eq('id', props.appointmentId)
      .single()
    
    if (error) throw error
    
    appointment.value = data
  } catch (err) {
    console.error('Error fetching appointment:', err)
  } finally {
    loading.value = false
  }
})
</script>