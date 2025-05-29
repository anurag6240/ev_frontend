<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};

const navigateToDashboard = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              EV Charging Station Management
            </h1>
            <p class="text-base sm:text-lg md:text-xl mb-8">
              A complete solution for managing your network of electric vehicle charging stations.
              Monitor, control, and optimize your charging infrastructure in one place.
            </p>
            <div class="space-x-4">
              <button
                v-if="!authStore.isAuthenticated"
                @click="navigateToLogin"
                class="px-6 py-3 bg-white text-green-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
              <button
                v-if="!authStore.isAuthenticated"
                @click="navigateToRegister"
                class="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Create Account
              </button>
              <button
                v-if="authStore.isAuthenticated"
                @click="navigateToDashboard"
                class="px-6 py-3 bg-white text-green-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
          <div class="md:w-1/2 md:pl-10">
            <img 
              src="/charger.png" 
              alt="EV Charging Station" 
              class="rounded-lg shadow-xl w-2/3 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-xl sm:text-2xl">🗺️</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">Interactive Map</h3>
            <p class="text-sm sm:text-base text-gray-600">
              View all your charging stations on an interactive map with real-time status indicators.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-xl sm:text-2xl">📊</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">Status Monitoring</h3>
            <p class="text-sm sm:text-base text-gray-600">
              Monitor the status of all charging stations and quickly identify issues.
            </p>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-xl sm:text-2xl">🔍</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">Advanced Filtering</h3>
            <p class="text-sm sm:text-base text-gray-600">
              Filter stations by status, power output, connector type, and more.
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.hero-image-blend {
  mix-blend-mode: overlay;
}
</style>