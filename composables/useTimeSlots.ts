import { addMinutes, format, parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns'

interface BusinessHour {
  day_of_week: number
  start_time: string
  end_time: string
}

interface BlockedDate {
  start_date: string
  end_date: string
}

interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

export function useTimeSlots() {
  const supabase = useSupabaseClient()
  
  const getAvailableTimeSlots = async (
    date: Date, 
    serviceId: string
  ): Promise<TimeSlot[]> => {
    try {
      // Get selected service duration
      const { data: service } = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', serviceId)
        .single()
      
      if (!service) {
        throw new Error('Service not found')
      }
      
      const serviceDuration = service.duration_minutes
      
      // Get business hours for the day of week
      const dayOfWeek = date.getDay() // 0 is Sunday, 1 is Monday, etc.
      const { data: businessHours } = await supabase
        .from('business_hours')
        .select('*')
        .eq('day_of_week', dayOfWeek)
      
      // If no business hours are defined for this day, return empty array
      if (!businessHours || businessHours.length === 0) {
        return []
      }
      
      // Check if this day is blocked
      const dateStr = format(date, 'yyyy-MM-dd')
      const { data: blockedDates } = await supabase
        .from('blocked_dates')
        .select('*')
        .lte('start_date', dateStr)
        .gte('end_date', dateStr)
      
      // If this day is blocked, return empty array
      if (blockedDates && blockedDates.length > 0) {
        return []
      }
      
      // Get existing appointments for this day
      const startOfDayDate = startOfDay(date)
      const endOfDayDate = endOfDay(date)
      
      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('starts_at, ends_at')
        .gte('starts_at', startOfDayDate.toISOString())
        .lte('starts_at', endOfDayDate.toISOString())
        .not('status', 'eq', 'cancelled')
      
      // Parse business hours
      const businessHour = businessHours[0] as BusinessHour
      
      // Create time slots
      const slots: TimeSlot[] = []
      const slotDuration = 15 // 15-minute intervals
      
      // Parse opening and closing times
      const [openHour, openMinute] = businessHour.start_time.split(':').map(Number)
      const [closeHour, closeMinute] = businessHour.end_time.split(':').map(Number)
      
      const opening = new Date(date)
      opening.setHours(openHour, openMinute, 0, 0)
      
      const closing = new Date(date)
      closing.setHours(closeHour, closeMinute, 0, 0)
      
      // Current time
      const now = new Date()
      
      // Generate time slots in 15-minute intervals
      let slotStart = opening
      
      while (addMinutes(slotStart, serviceDuration) <= closing) {
        const slotEnd = addMinutes(slotStart, serviceDuration)
        
        // Check if slot is in the past
        const isInPast = isBefore(slotStart, now)
        
        // Check if slot overlaps with existing appointments
        const isOverlapping = existingAppointments?.some(appointment => {
          const appointmentStart = parseISO(appointment.starts_at)
          const appointmentEnd = parseISO(appointment.ends_at)
          
          return (
            (isAfter(slotStart, appointmentStart) && isBefore(slotStart, appointmentEnd)) ||
            (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
            (isBefore(slotStart, appointmentStart) && isAfter(slotEnd, appointmentEnd)) ||
            (slotStart.getTime() === appointmentStart.getTime()) ||
            (slotEnd.getTime() === appointmentEnd.getTime())
          )
        })
        
        // Add slot to array if it's available
        if (!isInPast && !isOverlapping) {
          slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            available: true
          })
        }
        
        // Move to next slot
        slotStart = addMinutes(slotStart, slotDuration)
      }
      
      return slots
    } catch (error) {
      console.error('Error getting available time slots:', error)
      return []
    }
  }
  
  return {
    getAvailableTimeSlots
  }
}