<template>
  <Button variant="ghost" size="icon" @click="toggleTheme">
    <Sun v-if="isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>