<template>
  <div class="container mx-auto py-12 px-4">
    <div class="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="text-center">Sign In</CardTitle>
          <CardDescription class="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div v-if="error" class="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {{ error }}
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="your.email@example.com" required />
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password">Password</Label>
                <NuxtLink to="/auth/forgot-password" class="text-sm text-primary hover:underline">
                  Forgot password?
                </NuxtLink>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </div>
            
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Sign In
            </Button>
          </form>
          
          <div class="mt-6 text-center text-sm">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-primary hover:underline">
              Sign up
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

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    
    toast.success('Sign in successful!')
    
    // Redirect to dashboard if admin, account if client
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/account')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to sign in'
  } finally {
    isLoading.value = false
  }
}
</script>