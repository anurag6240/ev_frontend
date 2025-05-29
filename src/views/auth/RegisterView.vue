<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const formError = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  // Validate form
  if (!name.value || !email.value || !password.value) {
    formError.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 6) {
    formError.value = 'Password must be at least 6 characters';
    return;
  }

  formError.value = '';
  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  });

  if (success) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-12rem)]">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">Create Account</h1>
        <p class="mt-2 text-gray-600">Sign up to start managing charging stations</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div v-if="formError" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ formError }}
        </div>
        
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            id="name" 
            v-model="name" 
            type="text" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="John Doe"
          />
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
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
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
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Already have an account? 
          <router-link to="/login" class="font-medium text-green-600 hover:text-green-500">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>