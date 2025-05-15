import { defineStore } from 'pinia'

export interface Appointment {
  id: string
  client_id: string
  service_id: string
  barber_id: string
  starts_at: string
  ends_at: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  created_at: string
}

export interface AppointmentWithDetails extends Appointment {
  services: {
    name: string
    duration_minutes: number
    price_cents: number
  }
  clients: {
    name: string
    email: string
    phone: string
  }
}

export interface AppointmentsState {
  appointments: AppointmentWithDetails[]
  loading: boolean
  error: string | null
}

export const useAppointmentsStore = defineStore('appointments', {
  state: (): AppointmentsState => ({
    appointments: [],
    loading: false,
    error: null
  }),
  
  getters: {
    upcomingAppointments: (state) => {
      const now = new Date()
      return state.appointments
        .filter(appt => new Date(appt.starts_at) > now && appt.status !== 'cancelled')
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    },
    
    todayAppointments: (state) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      return state.appointments
        .filter(appt => {
          const apptDate = new Date(appt.starts_at)
          return apptDate >= today && apptDate < tomorrow && appt.status !== 'cancelled'
        })
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    },
    
    clientAppointments: (state) => (clientId: string) => {
      return state.appointments
        .filter(appt => appt.client_id === clientId)
        .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    },
    
    appointmentsByDateRange: (state) => (startDate: Date, endDate: Date) => {
      return state.appointments
        .filter(appt => {
          const apptDate = new Date(appt.starts_at)
          return apptDate >= startDate && apptDate <= endDate
        })
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    }
  },
  
  actions: {
    async fetchAppointments() {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
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
          .order('starts_at')
        
        if (error) throw error
        
        this.appointments = data
      } catch (error) {
        console.error('Error fetching appointments:', error)
        this.error = error instanceof Error ? error.message : 'Failed to fetch appointments'
      } finally {
        this.loading = false
      }
    },
    
    async fetchClientAppointments(clientId: string) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
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
          .eq('client_id', clientId)
          .order('starts_at', { ascending: false })
        
        if (error) throw error
        
        this.appointments = data
      } catch (error) {
        console.error('Error fetching client appointments:', error)
        this.error = error instanceof Error ? error.message : 'Failed to fetch appointments'
      } finally {
        this.loading = false
      }
    },
    
    async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
          .from('appointments')
          .insert(appointment)
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
          .single()
        
        if (error) throw error
        
        this.appointments.push(data)
        this.appointments.sort((a, b) => 
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        )
        
        return data
      } catch (error) {
        console.error('Error creating appointment:', error)
        this.error = error instanceof Error ? error.message : 'Failed to create appointment'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateAppointmentStatus(id: string, status: Appointment['status']) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
          .from('appointments')
          .update({ status })
          .eq('id', id)
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
          .single()
        
        if (error) throw error
        
        const index = this.appointments.findIndex(appt => appt.id === id)
        if (index !== -1) {
          this.appointments[index] = data
        }
        
        return data
      } catch (error) {
        console.error('Error updating appointment status:', error)
        this.error = error instanceof Error ? error.message : 'Failed to update appointment status'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async cancelAppointment(id: string) {
      return this.updateAppointmentStatus(id, 'cancelled')
    }
  }
})