<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="container mx-auto px-4 py-20 relative z-10">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Professional Haircuts & Styling</h1>
          <p class="text-lg md:text-xl mb-8">
            Book your appointment online with our experienced barber for a premium haircut experience.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <NuxtLink to="/book">Book Now</NuxtLink>
            </Button>
            <Button size="lg" variant="outline" class="bg-white/10 backdrop-blur-sm" asChild>
              <NuxtLink to="/services">View Services</NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Services -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Our Services</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our range of professional haircuts and styling services, all delivered with expert precision.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-if="servicesStore.loading" class="col-span-full flex justify-center py-10">
            <div class="flex items-center gap-2">
              <Loader2 class="h-5 w-5 animate-spin" />
              <span>Loading services...</span>
            </div>
          </div>
          
          <ServiceCard
            v-for="service in displayedServices"
            :key="service.id"
            :service="service"
            @book="navigateTo(`/book?service=${service.id}`)"
          />
        </div>
        
        <div class="mt-12 text-center">
          <Button variant="outline" asChild>
            <NuxtLink to="/services">View All Services</NuxtLink>
          </Button>
        </div>
      </div>
    </section>
    
    <!-- About Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <h2 class="text-3xl font-bold mb-4">Expert Barber Services</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              With over 10 years of experience, our barber brings precision and style to every cut. 
              We take pride in creating the perfect look for each client, ensuring satisfaction with every visit.
            </p>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Our shop offers a relaxed, comfortable environment where you can unwind while getting a 
              professional haircut tailored to your preferences.
            </p>
            <Button variant="outline" asChild>
              <NuxtLink to="/contact">Contact Us</NuxtLink>
            </Button>
          </div>
          
          <div class="order-1 md:order-2">
            <img 
              src="https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg" 
              alt="Barber shop interior" 
              class="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experiences.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-amber-400">
                <Star v-for="i in 5" :key="i" class="h-4 w-4" :class="{ 'fill-current': i <= testimonial.rating }" />
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ testimonial.comment }}</p>
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User class="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div class="ml-3">
                <p class="font-medium">{{ testimonial.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-16 bg-primary">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready for a Fresh Look?</h2>
        <p class="text-white/90 mb-8 max-w-2xl mx-auto">
          Book your appointment today and experience the difference of a professional haircut.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <NuxtLink to="/book">Book Your Appointment</NuxtLink>
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Star, User } from 'lucide-vue-next'
import { useServicesStore } from '~/stores/services'

const servicesStore = useServicesStore()

// Fetch services when component mounts
onMounted(async () => {
  if (servicesStore.services.length === 0) {
    await servicesStore.fetchServices()
  }
})

// Only show first 3 active services
const displayedServices = computed(() => {
  return servicesStore.activeServices.slice(0, 3)
})

// Sample testimonials
const testimonials = [
  {
    name: 'John Smith',
    rating: 5,
    comment: 'Best haircut I've had in years. The barber took the time to understand exactly what I wanted and delivered perfectly.',
    date: '2 weeks ago'
  },
  {
    name: 'Michael Johnson',
    rating: 5,
    comment: 'Great experience from booking to the actual haircut. The online booking system was convenient and the service was exceptional.',
    date: '1 month ago'
  },
  {
    name: 'David Williams',
    rating: 4,
    comment: 'Very professional service. I appreciate the attention to detail and the relaxed atmosphere of the shop.',
    date: '2 months ago'
  }
]
</script>