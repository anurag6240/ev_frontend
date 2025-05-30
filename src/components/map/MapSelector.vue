<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';

const props = defineProps<{
  initialLocation: { lat: number; lng: number };
}>();

const emit = defineEmits<{
  (e: 'location-selected', location: { lat: number; lng: number }): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const currentLocationMarker = ref<L.Marker | null>(null);
const isLocating = ref(false);
const locationError = ref<string | null>(null);

onMounted(() => {
  if (mapContainer.value) {
    try {
      initMap();
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }
});

onUnmounted(() => {
  // Clean up map instance
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});

// Watch for changes to initialLocation
watch(() => props.initialLocation, (newLocation) => {
  if (map.value && marker.value) {
    marker.value.setLatLng([newLocation.lat, newLocation.lng]);
    map.value.setView([newLocation.lat, newLocation.lng], map.value.getZoom());
  }
}, { deep: true });

const initMap = () => {
  if (!mapContainer.value) return;

  // Create map instance with explicit type
  const mapInstance = L.map(mapContainer.value).setView([props.initialLocation.lat, props.initialLocation.lng], 13) as L.Map;
  map.value = mapInstance;
  
  // Add tile layer (OpenStreetMap)
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  });
  
  tileLayer.addTo(mapInstance);
  
  // Add initial marker
  marker.value = L.marker([props.initialLocation.lat, props.initialLocation.lng], {
    draggable: true
  }).addTo(mapInstance);
  
  // Add click handler to map
  mapInstance.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    marker.value?.setLatLng([lat, lng]);
    emit('location-selected', { lat, lng });
  });
  
  // Add drag end handler to marker
  marker.value.on('dragend', () => {
    const position = marker.value?.getLatLng();
    if (position) {
      emit('location-selected', { lat: position.lat, lng: position.lng });
    }
  });
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser';
    return;
  }

  isLocating.value = true;
  locationError.value = null;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      // Remove existing current location marker if any
      if (currentLocationMarker.value) {
        currentLocationMarker.value.remove();
      }

      if (map.value) {
        // Create a new marker for current location
        const currentLocationIcon = L.divIcon({
          html: '<div class="current-location-marker"></div>',
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        currentLocationMarker.value = L.marker([latitude, longitude], {
          icon: currentLocationIcon,
          zIndexOffset: 1000 // Ensure it's above other markers
        }).addTo(map.value);

        // Center map on current location
        map.value.setView([latitude, longitude], 15);

        // Update the main marker and emit the new location
        marker.value?.setLatLng([latitude, longitude]);
        emit('location-selected', { lat: latitude, lng: longitude });
      }

      isLocating.value = false;
    },
    (error) => {
      isLocating.value = false;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = 'Please allow location access to use this feature';
          break;
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          locationError.value = 'Location request timed out';
          break;
        default:
          locationError.value = 'An unknown error occurred';
      }
    }
  );
};
</script>

<template>
  <div class="relative w-full h-[60vh]">
    <div ref="mapContainer" class="w-full h-full rounded-lg"></div>
    
    <!-- Current Location Button -->
    <button
      @click="getCurrentLocation"
      class="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-transform hover:scale-105"
      :disabled="isLocating"
      title="Use current location"
    >
      <div v-if="isLocating" class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <!-- Error Message -->
    <div
      v-if="locationError"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded"
      role="alert"
    >
      <span class="block sm:inline">{{ locationError }}</span>
    </div>
  </div>
</template>

<style scoped>
.leaflet-container {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
}

.current-location-marker {
  width: 16px;
  height: 16px;
  background-color: #3B82F6;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
