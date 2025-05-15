<template>
  <nav aria-label="Progress">
    <ol class="flex items-center">
      <li 
        v-for="(step, stepIdx) in steps" 
        :key="stepIdx"
        class="relative"
        :class="[
          stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
          stepIdx !== 0 ? 'pl-8 sm:pl-20' : ''
        ]"
      >
        <!-- Step connector -->
        <div 
          v-if="stepIdx !== steps.length - 1" 
          class="absolute top-4 left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-700"
          :class="{ 'bg-primary': stepIdx < currentStep }"
        ></div>
        
        <div class="relative flex items-center justify-center">
          <!-- Completed step -->
          <template v-if="stepIdx < currentStep">
            <div 
              class="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
              aria-hidden="true"
            >
              <Check class="h-5 w-5 text-white" />
            </div>
            <span class="hidden sm:block absolute bottom-0 translate-y-8 text-xs font-medium text-gray-500 dark:text-gray-400">
              {{ step.name }}
            </span>
          </template>
          
          <!-- Current step -->
          <template v-else-if="stepIdx === currentStep">
            <div 
              class="h-8 w-8 rounded-full border-2 border-primary bg-white dark:bg-gray-800 flex items-center justify-center"
              aria-hidden="true"
            >
              <span class="text-primary text-sm font-semibold">{{ stepIdx + 1 }}</span>
            </div>
            <span class="hidden sm:block absolute bottom-0 translate-y-8 text-xs font-semibold text-primary">
              {{ step.name }}
            </span>
          </template>
          
          <!-- Upcoming step -->
          <template v-else>
            <div 
              class="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center"
              aria-hidden="true"
            >
              <span class="text-gray-400 dark:text-gray-500 text-sm">{{ stepIdx + 1 }}</span>
            </div>
            <span class="hidden sm:block absolute bottom-0 translate-y-8 text-xs font-medium text-gray-500 dark:text-gray-400">
              {{ step.name }}
            </span>
          </template>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = defineProps<{
  currentStep: number
  steps: Array<{
    name: string
    description: string
  }>
}>()
</script>