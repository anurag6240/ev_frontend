<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStationsStore, type ChargingStation } from '../../stores/stations';
import MapSelector from '../../components/map/MapSelector.vue';

const route = useRoute();
const router = useRouter();
const stationsStore = useStationsStore();

const stationId = computed(() => route.params.id as string);
const isEditMode = computed(() => !!stationId.value);
const pageTitle = computed(() => isEditMode.value ? 'Edit Charging Station' : 'Add New Charging Station');

// Form state
const name = ref('');
const address = ref('');
const status = ref('active');
const powerOutput = ref<number>(50);
const connectorType = ref('Type 2');
const location = ref({ lat: 40.7128, lng: -74.006 }); // Default to NYC

// Validation
const errors = ref<Record<string, string>>({});
const isLoading = computed(() => stationsStore.loading);

// Status options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Under Maintenance' }
];

// Connector types
const connectorTypes = [
  { value: 'Type 1', label: 'Type 1' },
  { value: 'Type 2', label: 'Type 2' },
  { value: 'CCS', label: 'CCS' },
  { value: 'CHAdeMO', label: 'CHAdeMO' },
  { value: 'Tesla', label: 'Tesla' }
];

// Load station data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const station = await stationsStore.fetchStationById(stationId.value);
      if (station) {
        name.value = station.name;
        address.value = station.address;
        status.value = station.status;
        powerOutput.value = station.powerOutput;
        connectorType.value = station.connectorType;
        location.value = station.location;
      }
    } catch (error) {
      console.error('Failed to load station data:', error);
    }
  }
});

// Handle location selection from map
const handleLocationSelect = (newLocation: { lat: number; lng: number }) => {
  location.value = newLocation;
};

// Validate form
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!name.value.trim()) {
    newErrors.name = 'Name is required';
  }
  
  if (!address.value.trim()) {
    newErrors.address = 'Address is required';
  }
  
  if (!powerOutput.value || powerOutput.value <= 0) {
    newErrors.powerOutput = 'Power output must be a positive number';
  }
  
  if (!location.value.lat || !location.value.lng) {
    newErrors.location = 'Please select a location on the map';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) return;

  const stationData = {
    name: name.value,
    address: address.value,
    status: status.value as 'active' | 'inactive' | 'maintenance',
    powerOutput: powerOutput.value,
    connectorType: connectorType.value as 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla',
    location: location.value
  };

  try {
    if (isEditMode.value) {
      await stationsStore.updateStation(stationId.value, stationData);
    } else {
      await stationsStore.createStation(stationData);
    }
    router.push('/stations');
  } catch (error) {
    console.error('Failed to save station:', error);
  }
};

// Cancel form
const handleCancel = () => {
  router.push('/stations');
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <button @click="handleCancel" class="text-gray-600 hover:text-gray-900 mr-2">
        <span class="text-xl">←</span>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Station Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Station Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <input
              id="address"
              v-model="address"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              :class="{ 'border-red-500': errors.address }"
            />
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Power Output -->
          <div>
            <label for="powerOutput" class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
            <input
              id="powerOutput"
              v-model.number="powerOutput"
              type="number"
              min="0"
              step="0.1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              :class="{ 'border-red-500': errors.powerOutput }"
            />
            <p v-if="errors.powerOutput" class="mt-1 text-sm text-red-600">{{ errors.powerOutput }}</p>
          </div>

          <!-- Connector Type -->
          <div>
            <label for="connectorType" class="block text-sm font-medium text-gray-700">Connector Type</label>
            <select
              id="connectorType"
              v-model="connectorType"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option v-for="type in connectorTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Map Location Selector -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Station Location</label>
          <p class="text-sm text-gray-500 mb-2">Click on the map to select the exact location of the charging station</p>
          
          <div class="h-96 rounded-md overflow-hidden border border-gray-300 shadow-sm">
            <MapSelector 
              :initial-location="location" 
              @location-selected="handleLocationSelect" 
            />
          </div>
          <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
          
          <div class="mt-2 text-sm text-gray-500">
            Selected coordinates: {{ location.lat.toFixed(6) }}, {{ location.lng.toFixed(6) }}
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>