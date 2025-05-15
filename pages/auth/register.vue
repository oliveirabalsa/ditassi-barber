<template>
  <div class="container mx-auto py-12 px-4">
    <div class="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="text-center">Create Account</CardTitle>
          <CardDescription class="text-center">
            Sign up to book and manage your appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div v-if="error" class="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {{ error }}
            </div>
            
            <div class="space-y-2">
              <Label for="name">Full Name</Label>
              <Input id="name" v-model="name" type="text" placeholder="John Smith" required />
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="your.email@example.com" required />
            </div>
            
            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input id="phone" v-model="phone" type="tel" placeholder="(555) 123-4567" required />
            </div>
            
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" required />
              <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>
            
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Create Account
            </Button>
          </form>
          
          <div class="mt-6 text-center text-sm">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              Sign in
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''
  
  // Validate password
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    isLoading.value = false
    return
  }
  
  try {
    await authStore.register(email.value, password.value, name.value, phone.value)
    
    toast.success('Account created successfully!')
    
    // Redirect to account page
    router.push('/account')
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to create account'
  } finally {
    isLoading.value = false
  }
}
</script>