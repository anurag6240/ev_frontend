<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-4">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-2xl text-gray-600 mb-8">Page not found</p>
    <p class="text-gray-500 max-w-md text-center mb-8">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <div class="flex space-x-4">
      <button 
        @click="goBack" 
        class="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
      >
        Go Back
      </button>
      <button 
        @click="goHome" 
        class="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
</template>