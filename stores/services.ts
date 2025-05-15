import { defineStore } from 'pinia'

export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url?: string
  active: boolean
  created_at: string
}

export interface ServicesState {
  services: Service[]
  loading: boolean
  error: string | null
}

export const useServicesStore = defineStore('services', {
  state: (): ServicesState => ({
    services: [],
    loading: false,
    error: null
  }),
  
  getters: {
    activeServices: (state) => state.services.filter(service => service.active),
    
    getServiceById: (state) => (id: string) => {
      return state.services.find(service => service.id === id)
    },
    
    formattedServices: (state) => {
      return state.services.map(service => ({
        ...service,
        price: (service.price_cents / 100).toFixed(2),
        duration: `${service.duration_minutes} min`
      }))
    }
  },
  
  actions: {
    async fetchServices() {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
          .from('services')
          .select('*')
          .order('name')
        
        if (error) throw error
        
        this.services = data
      } catch (error) {
        console.error('Error fetching services:', error)
        this.error = error instanceof Error ? error.message : 'Failed to fetch services'
      } finally {
        this.loading = false
      }
    },
    
    async addService(service: Omit<Service, 'id' | 'created_at'>) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
          .from('services')
          .insert(service)
          .select()
          .single()
        
        if (error) throw error
        
        this.services.push(data)
        this.services.sort((a, b) => a.name.localeCompare(b.name))
      } catch (error) {
        console.error('Error adding service:', error)
        this.error = error instanceof Error ? error.message : 'Failed to add service'
      } finally {
        this.loading = false
      }
    },
    
    async updateService(id: string, updates: Partial<Omit<Service, 'id' | 'created_at'>>) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
          .from('services')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        const index = this.services.findIndex(service => service.id === id)
        if (index !== -1) {
          this.services[index] = data
        }
      } catch (error) {
        console.error('Error updating service:', error)
        this.error = error instanceof Error ? error.message : 'Failed to update service'
      } finally {
        this.loading = false
      }
    },
    
    async toggleServiceActive(id: string, active: boolean) {
      return this.updateService(id, { active })
    },
    
    async deleteService(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { error } = await client
          .from('services')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        this.services = this.services.filter(service => service.id !== id)
      } catch (error) {
        console.error('Error deleting service:', error)
        this.error = error instanceof Error ? error.message : 'Failed to delete service'
      } finally {
        this.loading = false
      }
    }
  }
})