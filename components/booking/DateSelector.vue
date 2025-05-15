<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Choose a Date</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="md:pr-4">
        <Calendar
          v-model="selectedDate"
          :disabled-dates="disabledDates"
          class="rounded-md border"
        />
      </div>
      
      <div class="mt-6 md:mt-0">
        <div v-if="!selectedDate" class="text-center py-8 text-gray-500">
          <Calendar class="h-12 w-12 mx-auto opacity-30" />
          <p class="mt-2">Please select a date to view available time slots</p>
        </div>
        
        <div v-else-if="loadingSlots" class="flex justify-center py-8">
          <div class="flex items-center gap-2">
            <Loader2 class="h-5 w-5 animate-spin" />
            <span>Loading available times...</span>
          </div>
        </div>
        
        <div v-else>
          <h3 class="font-medium mb-4">Available Times for {{ formatDateLong(selectedDate) }}</h3>
          
          <div v-if="availableSlots.length === 0" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            <p>No available time slots for this date.</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Please select a different date or contact us for special arrangements.
            </p>
          </div>
          
          <div v-else class="grid grid-cols-3 gap-2">
            <Button
              v-for="(slot, index) in availableSlots"
              :key="index"
              :variant="selectedSlot === slot ? 'default' : 'outline'"
              class="h-auto py-2"
              @click="selectTimeSlot(slot)"
            >
              {{ formatTime(new Date(slot.startTime)) }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="$emit('back')">
        Back
      </Button>
      <Button 
        :disabled="!selectedSlot"
        @click="confirmSelection"
      >
        Continue
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addDays, format, isWeekend, startOfToday } from 'date-fns'
import { Calendar, Loader2 } from 'lucide-vue-next'
import type { Service } from '~/stores/services'
import type { TimeSlot } from '~/composables/useTimeSlots'

const props = defineProps<{
  service: Service
}>()

const emit = defineEmits<{
  back: []
  next: [date: Date, startTime: string, endTime: string]
}>()

const selectedDate = ref<Date>(new Date())
const selectedSlot = ref<TimeSlot | null>(null)
const availableSlots = ref<TimeSlot[]>([])
const loadingSlots = ref(false)

const { getAvailableTimeSlots } = useTimeSlots()

// Define the date range for the calendar (e.g., today + 30 days)
const today = startOfToday()
const maxDate = addDays(today, 30)

// Disable past dates and weekends if the shop is closed on weekends
const disabledDates = {
  before: today
}

// Format time (e.g., "10:00 AM")
const formatTime = (date: Date) => {
  return format(date, 'h:mm a')
}

// Format date for display (e.g., "Monday, January 1")
const formatDateLong = (date: Date) => {
  return format(date, 'EEEE, MMMM d')
}

// Load available time slots when date changes
watch(selectedDate, async (newDate) => {
  if (!newDate) return
  
  selectedSlot.value = null
  loadingSlots.value = true
  
  try {
    const slots = await getAvailableTimeSlots(newDate, props.service.id)
    availableSlots.value = slots
  } catch (error) {
    console.error('Error loading time slots:', error)
  } finally {
    loadingSlots.value = false
  }
})

// Initialize available slots
onMounted(async () => {
  if (selectedDate.value) {
    loadingSlots.value = true
    
    try {
      const slots = await getAvailableTimeSlots(selectedDate.value, props.service.id)
      availableSlots.value = slots
    } catch (error) {
      console.error('Error loading time slots:', error)
    } finally {
      loadingSlots.value = false
    }
  }
})

const selectTimeSlot = (slot: TimeSlot) => {
  selectedSlot.value = slot
}

const confirmSelection = () => {
  if (selectedDate.value && selectedSlot.value) {
    emit('next', 
      selectedDate.value, 
      selectedSlot.value.startTime, 
      selectedSlot.value.endTime
    )
  }
}
</script>