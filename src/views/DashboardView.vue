<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStationsStore } from '../stores/stations';
import { useAuthStore } from '../stores/auth';
import StatusCard from '../components/dashboard/StatusCard.vue';

const stationsStore = useStationsStore();
const authStore = useAuthStore();
const isLoading = ref(true);

// Dashboard summary data
const stats = ref({
  totalStations: 0,
  activeStations: 0,
  inactiveStations: 0,
  maintenanceStations: 0
});

// Computed user name
const userName = computed(() => {
  return authStore.user?.name || 'User';
});

onMounted(async () => {
  try {
    await stationsStore.fetchStations();
    calculateStats();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

const calculateStats = () => {
  const stations = stationsStore.stations;
  stats.value = {
    totalStations: stations.length,
    activeStations: stations.filter(s => s.status === 'active').length,
    inactiveStations: stations.filter(s => s.status === 'inactive').length,
    maintenanceStations: stations.filter(s => s.status === 'maintenance').length
  };
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Welcome back, {{ userName }}</p>
    </div>

    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Total Stations"
          :value="stats.totalStations"
          icon="📊"
          color="bg-blue-500"
        />
        <StatusCard
          title="Active Stations"
          :value="stats.activeStations"
          icon="✅"
          color="bg-green-500"
        />
        <StatusCard
          title="Inactive Stations"
          :value="stats.inactiveStations"
          icon="⏸️"
          color="bg-gray-500"
        />
        <StatusCard
          title="Under Maintenance"
          :value="stats.maintenanceStations"
          icon="🔧"
          color="bg-amber-500"
        />
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/stations/new"
            class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
          >
            <span class="text-2xl mr-3">➕</span>
            <div>
              <h3 class="font-medium text-green-700">Add Station</h3>
              <p class="text-sm text-green-600">Create a new charging station</p>
            </div>
          </router-link>
          
          <router-link
            to="/stations"
            class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
          >
            <span class="text-2xl mr-3">📋</span>
            <div>
              <h3 class="font-medium text-blue-700">View Stations</h3>
              <p class="text-sm text-blue-600">Manage your charging stations</p>
            </div>
          </router-link>
          
          <router-link
            to="/map"
            class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
          >
            <span class="text-2xl mr-3">🗺️</span>
            <div>
              <h3 class="font-medium text-purple-700">Map View</h3>
              <p class="text-sm text-purple-600">See stations on the map</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Getting Started Guide -->
      <div v-if="stats.totalStations === 0" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <div class="p-4 bg-blue-50 rounded-lg mb-4">
          <p class="text-blue-700">
            Welcome to the EV Charging Station Management System! Follow these steps to get started:
          </p>
        </div>
        
        <ol class="space-y-4">
          <li class="flex items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold mr-3">1</span>
            <div>
              <h3 class="font-medium text-gray-800">Add Your First Charging Station</h3>
              <p class="text-gray-600">Create your first charging station by clicking on "Add Station" above.</p>
            </div>
          </li>
          
          <li class="flex items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold mr-3">2</span>
            <div>
              <h3 class="font-medium text-gray-800">View Stations on the Map</h3>
              <p class="text-gray-600">After adding stations, you can view them on the interactive map.</p>
            </div>
          </li>
          
          <li class="flex items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold mr-3">3</span>
            <div>
              <h3 class="font-medium text-gray-800">Manage Your Network</h3>
              <p class="text-gray-600">Update station details, change status, or remove stations as needed.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>