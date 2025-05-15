import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAdmin: false,
    loading: true
  }),
  
  actions: {
    async init() {
      this.loading = true
      
      try {
        const client = useSupabaseClient()
        
        // Get current session
        const { data: { session } } = await client.auth.getSession()
        
        if (session?.user) {
          this.user = session.user
          await this.checkAdminStatus()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async login(email: string, password: string) {
      const client = useSupabaseClient()
      
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      this.user = data.user
      await this.checkAdminStatus()
      
      return data
    },
    
    async register(email: string, password: string, name: string, phone: string) {
      const client = useSupabaseClient()
      
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        this.user = data.user
        
        // Create a client record
        const { error: profileError } = await client
          .from('clients')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name,
            phone
          })
        
        if (profileError) throw profileError
      }
      
      return data
    },
    
    async logout() {
      const client = useSupabaseClient()
      const { error } = await client.auth.signOut()
      
      if (error) throw error
      
      this.user = null
      this.isAdmin = false
    },
    
    async checkAdminStatus() {
      if (!this.user) return
      
      const client = useSupabaseClient()
      
      // Check if user is in the admin list
      const { data, error } = await client
        .from('admins')
        .select('*')
        .eq('user_id', this.user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error)
      }
      
      this.isAdmin = !!data
    }
  }
})