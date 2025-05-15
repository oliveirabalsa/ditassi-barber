<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Your Information</h2>
    
    <Form 
      :validation-schema="validationSchema"
      @submit="onSubmit"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField
            name="name"
            v-slot="{ field, errors }"
          >
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="John Smith" 
                  v-bind="field"
                />
              </FormControl>
              <FormMessage v-if="errors">{{ errors }}</FormMessage>
            </FormItem>
          </FormField>
        </div>
        
        <div>
          <FormField
            name="phone"
            v-slot="{ field, errors }"
          >
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="(555) 123-4567" 
                  v-bind="field"
                />
              </FormControl>
              <FormMessage v-if="errors">{{ errors }}</FormMessage>
            </FormItem>
          </FormField>
        </div>
      </div>
      
      <FormField
        name="email"
        v-slot="{ field, errors }"
      >
        <FormItem>
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input 
              type="email" 
              placeholder="your.email@example.com" 
              v-bind="field"
            />
          </FormControl>
          <FormMessage v-if="errors">{{ errors }}</FormMessage>
        </FormItem>
      </FormField>
      
      <FormField
        name="notes"
        v-slot="{ field }"
      >
        <FormItem>
          <FormLabel>Additional Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Any special requests or information the barber should know" 
              v-bind="field"
            />
          </FormControl>
        </FormItem>
      </FormField>
      
      <div class="pt-4 mt-4 border-t flex justify-between">
        <Button type="button" variant="outline" @click="$emit('back')">
          Back
        </Button>
        <Button type="submit" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </Button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { Loader2 } from 'lucide-vue-next'

const isSubmitting = ref(false)

const props = defineProps<{
  initialData?: ClientInfo
}>()

const emit = defineEmits<{
  back: []
  next: [clientInfo: ClientInfo]
}>()

interface ClientInfo {
  name: string
  email: string
  phone: string
  notes?: string
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  notes: yup.string()
})

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: props.initialData || {
    name: '',
    email: '',
    phone: '',
    notes: ''
  }
})

const onSubmit = handleSubmit((values) => {
  isSubmitting.value = true
  
  // Small delay to simulate processing
  setTimeout(() => {
    emit('next', values)
    isSubmitting.value = false
  }, 600)
})
</script>