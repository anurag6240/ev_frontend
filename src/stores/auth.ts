import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';
import { toast } from 'vue3-toastify';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Check if user is already authenticated
  function checkAuth() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  // Register a new user
  async function register(userData: { name: string; email: string; password: string }) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/register', userData);
      const { data } = response.data;
      
      user.value = data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Registration successful!');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      error.value = message;
      toast.error(message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Login user
  async function login(credentials: { email: string; password: string }) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/login', credentials);
      const { data } = response.data;
      
      user.value = data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Login successful!');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      error.value = message;
      toast.error(message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Logout user
  function logout() {
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    checkAuth,
    register,
    login,
    logout
  };
});