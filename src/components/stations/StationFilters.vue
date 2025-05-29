<script setup lang="ts">
import { ref, watch } from 'vue';
import type { StationFilters } from '../../stores/stations';

const emit = defineEmits<{
  (e: 'filter-change', filters: StationFilters): void;
}>();

// Filter state
const status = ref<string>('');
const connectorType = ref<string>('');
const minPower = ref<number | null>(null);
const maxPower = ref<number | null>(null);
const isFilterExpanded = ref(false);

// Status options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Under Maintenance' }
];

// Connector types
const connectorTypes = [
  { value: '', label: 'All Connectors' },
  { value: 'Type 1', label: 'Type 1' },
  { value: 'Type 2', label: 'Type 2' },
  { value: 'CCS', label: 'CCS' },
  { value: 'CHAdeMO', label: 'CHAdeMO' },
  { value: 'Tesla', label: 'Tesla' }
];

// Apply filters when values change
watch([status, connectorType, minPower, maxPower], () => {
  applyFilters();
}, { deep: true });

// Apply filters
const applyFilters = () => {
  const filters: StationFilters = {};
  
  if (status.value) filters.status = status.value;
  if (connectorType.value) filters.connectorType = connectorType.value;
  if (minPower.value !== null) filters.minPower = minPower.value;
  if (maxPower.value !== null) filters.maxPower = maxPower.value;
  
  emit('filter-change', filters);
};

// Reset filters
const resetFilters = () => {
  status.value = '';
  connectorType.value = '';
  minPower.value = null;
  maxPower.value = null;
  applyFilters();
};

// Toggle filter panel visibility
const toggleFilters = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-800">Filters</h2>
      <button 
        @click="toggleFilters" 
        class="text-sm text-gray-600 hover:text-gray-800"
      >
        {{ isFilterExpanded ? 'Hide Filters' : 'Show Filters' }}
      </button>
    </div>
    
    <div v-if="isFilterExpanded" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          id="status" 
          v-model="status" 
          class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <!-- Connector Type Filter -->
      <div>
        <label for="connectorType" class="block text-sm font-medium text-gray-700 mb-1">Connector Type</label>
        <select 
          id="connectorType" 
          v-model="connectorType" 
          class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option v-for="type in connectorTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
      
      <!-- Min Power Filter -->
      <div>
        <label for="minPower" class="block text-sm font-medium text-gray-700 mb-1">Min Power (kW)</label>
        <input 
          id="minPower" 
          v-model.number="minPower" 
          type="number" 
          min="0"
          placeholder="Min kW"
          class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      
      <!-- Max Power Filter -->
      <div>
        <label for="maxPower" class="block text-sm font-medium text-gray-700 mb-1">Max Power (kW)</label>
        <input 
          id="maxPower" 
          v-model.number="maxPower" 
          type="number" 
          min="0"
          placeholder="Max kW"
          class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      
      <!-- Reset Button -->
      <div class="md:col-span-2 lg:col-span-4 flex justify-end mt-2">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>