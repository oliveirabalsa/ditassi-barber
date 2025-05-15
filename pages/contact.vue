<template>
  <div class="container mx-auto py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Contact Us</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-12">
        Have questions or need assistance? Contact us using the information below or send us a message.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent class="p-6 flex flex-col items-center text-center">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Location</h3>
            <p class="text-gray-600 dark:text-gray-400">
              123 Main Street<br>
              Anytown, CA 12345
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="p-6 flex flex-col items-center text-center">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Phone</h3>
            <p class="text-gray-600 dark:text-gray-400">
              (555) 123-4567
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Mon-Fri: 9am - 7pm<br>
              Sat: 9am - 5pm
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="p-6 flex flex-col items-center text-center">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Email</h3>
            <p class="text-gray-600 dark:text-gray-400">
              info@barberbook.com
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              We aim to respond within 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent class="p-6">
          <h2 class="text-xl font-semibold mb-6">Send Us a Message</h2>
          
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="name">Full Name</Label>
                <Input id="name" v-model="form.name" type="text" placeholder="John Smith" required />
              </div>
              
              <div>
                <Label for="email">Email</Label>
                <Input id="email" v-model="form.email" type="email" placeholder="your.email@example.com" required />
              </div>
            </div>
            
            <div>
              <Label for="subject">Subject</Label>
              <Input id="subject" v-model="form.subject" type="text" placeholder="Booking Question" required />
            </div>
            
            <div>
              <Label for="message">Message</Label>
              <Textarea 
                id="message" 
                v-model="form.message" 
                placeholder="How can we help you?" 
                class="min-h-32"
                required
              />
            </div>
            
            <div>
              <Button type="submit" class="w-full md:w-auto" :disabled="isSubmitting">
                <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div class="mt-12">
        <h2 class="text-xl font-semibold mb-6">Our Location</h2>
        <Card class="overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAuMCJOIDczwrA1NCcwLjAiVw!5e0!3m2!1sen!2sus!4v1609459098240!5m2!1sen!2sus" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Phone, Mail, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})

const isSubmitting = ref(false)
const formSubmitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  isSubmitting.value = true
  
  // Simulate form submission
  setTimeout(() => {
    isSubmitting.value = false
    formSubmitted.value = true
    
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    
    // Show success toast
    toast.success('Message sent successfully! We\'ll get back to you soon.')
  }, 1000)
}

const toast = useToast()
</script>