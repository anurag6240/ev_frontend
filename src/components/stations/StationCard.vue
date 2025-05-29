<script setup lang="ts">
import { computed } from 'vue';
import type { ChargingStation } from '../../stores/stations';

const props = defineProps<{
  station: ChargingStation;
}>();

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'view-on-map', id: string): void;
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

const handleDelete = () => {
  emit('delete', props.station._id);
};

const handleViewOnMap = () => {
  emit('view-on-map', props.station._id);
};
</script>

<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer"
    @click="handleViewOnMap"
  >
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-semibold text-gray-800">{{ station.name }}</h3>
        <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusColor]">
          {{ statusText }}
        </span>
      </div>
      
      <div class="space-y-2 mb-4">
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
      </div>
      
      <div class="pt-4 border-t border-gray-100 flex justify-end space-x-2">
        <button
          @click.stop="handleEdit"
          class="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
        >
          Edit
        </button>
        <button
          @click.stop="handleDelete"
          class="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>