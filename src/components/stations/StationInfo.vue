<script setup lang="ts">
import { computed } from 'vue';
import type { ChargingStation } from '../../stores/stations';

const props = defineProps<{
  station: ChargingStation;
}>();

defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'close'): void;
}>();

const statusColor = computed(() => {
  switch (props.station.status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'maintenance':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const statusText = computed(() => {
  switch (props.station.status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'maintenance':
      return 'Maintenance';
    default:
      return props.station.status;
  }
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
    <div class="p-4">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold text-gray-800 truncate">{{ station.name }}</h3>
        <button 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Status Badge -->
      <div class="mb-4">
        <span :class="['px-3 py-1 rounded-full text-xs font-medium', statusColor]">
          {{ statusText }}
        </span>
      </div>

      <!-- Station Details -->
      <div class="space-y-3 mb-4">
        <div class="flex items-start">
          <span class="text-gray-500 mr-2 mt-0.5">📍</span>
          <p class="text-gray-600 text-sm flex-1">{{ station.address }}</p>
        </div>
        
        <div class="flex items-start">
          <span class="text-gray-500 mr-2 mt-0.5">⚡</span>
          <p class="text-gray-600 text-sm flex-1">{{ station.powerOutput }} kW</p>
        </div>
        
        <div class="flex items-start">
          <span class="text-gray-500 mr-2 mt-0.5">🔌</span>
          <p class="text-gray-600 text-sm flex-1">{{ station.connectorType }}</p>
        </div>
        
        <div class="flex items-start">
          <span class="text-gray-500 mr-2 mt-0.5">📌</span>
          <p class="text-gray-600 text-sm flex-1">
            {{ station.location.lat.toFixed(6) }}, {{ station.location.lng.toFixed(6) }}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-3 border-t border-gray-100">
        <button 
          @click="$emit('edit', station._id)"
          class="w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Station
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
