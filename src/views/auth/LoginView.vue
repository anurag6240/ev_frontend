<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const formError = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    formError.value = 'Please enter both email and password';
    return;
  }

  formError.value = '';
  const success = await authStore.login({
    email: email.value,
    password: password.value
  });

  if (success) {
    // Redirect to the page they tried to access or dashboard
    const redirectPath = route.query.redirect as string || '/dashboard';
    router.push(redirectPath);
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-12rem)]">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p class="mt-2 text-gray-600">Sign in to manage your charging stations</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div v-if="formError" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ formError }}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="********"
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="font-medium text-green-600 hover:text-green-500">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>