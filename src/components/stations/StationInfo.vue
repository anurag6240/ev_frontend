<script setup lang="ts">
import { computed } from 'vue';
import type { ChargingStation } from '../../stores/stations';

const props = defineProps<{
  station: ChargingStation;
}>();

const emit = defineEmits<{
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

const handleEdit = () => {
  emit('edit', props.station._id);
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-4">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-semibold text-gray-800">{{ station.name }}</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>
      
      <div class="space-y-2 mb-3">
        <div class="flex items-center">
          <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusColor]">
            {{ statusText }}
          </span>
        </div>
        
        <p class="text-gray-600 text-sm flex items-start">
          <span class="mr-2">📍</span>
          {{ station.address }}
        </p>
        <p class="text-gray-600 text-sm flex items-start">
          <span class="mr-2">⚡</span>
          {{ station.powerOutput }} kW
        </p>
        <p class="text-gray-600 text-sm flex items-start">
          <span class="mr-2">🔌</span>
          {{ station.connectorType }}
        </p>
        <p class="text-gray-600 text-sm flex items-start">
          <span class="mr-2">📌</span>
          {{ station.location.lat.toFixed(6) }}, {{ station.location.lng.toFixed(6) }}
        </p>
      </div>
      
      <div class="pt-3 flex justify-center">
        <button
          @click="handleEdit"
          class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Edit Station
        </button>
      </div>
    </div>
  </div>
</template>