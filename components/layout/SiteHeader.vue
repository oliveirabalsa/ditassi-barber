<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
    <div class="container mx-auto py-4 px-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Scissors class="h-4 w-4 text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight">BarberBook</span>
      </NuxtLink>
      
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>
      
      <div class="flex items-center gap-4">
        <ThemeToggle />
        
        <Button v-if="!user" variant="default" size="sm" as-child>
          <NuxtLink to="/auth/login">Sign In</NuxtLink>
        </Button>
        
        <DropdownMenu v-else>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <UserCircle class="h-5 w-5" />
              <span class="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ user.email }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem v-if="isAdmin" @select="navigateTo('/admin')">
              <LayoutDashboard class="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem @select="navigateTo('/account')">
              <User class="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem @select="navigateTo('/account/appointments')">
              <Calendar class="mr-2 h-4 w-4" />
              <span>My Appointments</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @select="logout">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>BarberBook</SheetTitle>
            </SheetHeader>
            <nav class="flex flex-col gap-4 mt-6">
              <NuxtLink 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path"
                class="px-2 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {{ item.name }}
              </NuxtLink>
              
              <Button v-if="!user" class="mt-4" variant="default" @click="navigateTo('/auth/login')">
                Sign In
              </Button>
              
              <div v-else class="mt-4 flex flex-col gap-2">
                <Button v-if="isAdmin" variant="outline" @click="navigateTo('/admin')">
                  <LayoutDashboard class="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <Button variant="outline" @click="navigateTo('/account')">
                  <User class="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </Button>
                <Button variant="outline" @click="navigateTo('/account/appointments')">
                  <Calendar class="mr-2 h-4 w-4" />
                  <span>My Appointments</span>
                </Button>
                <Button variant="destructive" @click="logout">
                  <LogOut class="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { 
  Menu, 
  Scissors, 
  UserCircle, 
  User, 
  Calendar, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Book Now', path: '/book' },
  { name: 'Contact', path: '/contact' }
]

const logout = async () => {
  await authStore.logout()
  navigateTo('/')
}
</script>