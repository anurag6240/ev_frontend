<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStationsStore, type ChargingStation } from '../stores/stations';
import StationInfo from '../components/stations/StationInfo.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const stationsStore = useStationsStore();
const router = useRouter();
const route = useRoute();
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const selectedStation = ref<ChargingStation | null>(null);
const error = ref<string | null>(null);

const isLoadingOrEmpty = computed(() => stationsStore.loading || stationsStore.stations.length === 0);

onMounted(async () => {
  console.log('MapView mounted');
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 50)); // Reduced delay slightly

  if (mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect();
    console.log('Map container dimensions on mount:', rect.width, rect.height);
    if (rect.width === 0 || rect.height === 0) {
      console.error('Map container has zero dimensions on mount. Check layout styles.');
    }

    console.log('Initializing map...');
    await initMap();
    console.log('Map initialized');

    // Fetch all stations first
    try {
      console.log('Fetching all stations for map...');
      await stationsStore.fetchStations();
      console.log('All stations loaded for map:', stationsStore.stations);
      addStationsToMap();
      console.log('All stations added to map');
    } catch (err) {
       console.error('Error fetching/adding all stations after map init:', err);
       error.value = 'Failed to load stations for the map.';
    }

    // Check for stationId in route parameters and select/center if found
    const stationId = route.params.stationId as string | undefined;
    if (stationId) {
      console.log('Station ID found in route params:', stationId);
      const stationToSelect = stationsStore.stations.find(s => s._id === stationId);
      if (stationToSelect) {
        selectedStation.value = stationToSelect;
        console.log('Selected station from route params:', stationToSelect);
        // Center map on the selected station
        if (map.value) {
          map.value.setView([stationToSelect.location.lat, stationToSelect.location.lng], 15); // Zoom in a bit
          console.log('Map centered on selected station');
        }
      } else {
        console.warn('Station with ID not found:', stationId);
        // Optionally display an error or redirect
      }
    } else if (stationsStore.stations.length > 0) {
       // If no specific station ID, fit bounds to all stations if any exist
       const points = stationsStore.stations.map(s => [s.location.lat, s.location.lng]);
       map.value?.fitBounds(points as L.LatLngBoundsLiteral, { padding: [50, 50] });
       console.log('No station ID in route, fitting bounds to all stations');
    }

    // Invalidate map size after initial load and station add and potential view change
    await nextTick();
    if (map.value) {
      map.value.invalidateSize();
      console.log('Map size invalidated after initial load and station add');
    }

  } else {
    console.error('Map container ref not found on mount.');
    error.value = 'Internal error: Map container not found.';
  }
});

onUnmounted(() => {
  console.log('MapView unmounting');
  // Clean up map instance
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});

// Watch for changes in station data to update markers and view
// Watch route params for stationId changes
watch([() => stationsStore.stations, () => route.params.stationId], async ([newStations, newStationId], [oldStations, oldStationId]) => {
    console.log('Stations data or route params changed. Updating map.');
    
    // If only stations data changed, update markers
    if (map.value && newStations !== oldStations) { // Simple check, deep watch is active
        console.log('Stations data changed, updating markers.');
        // Clear existing markers (if any)
        map.value.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Marker) {
                map.value?.removeLayer(layer);
            }
        });
        addStationsToMap(); // Add markers for the new station list
        
        // Re-fit bounds only if no specific station is selected
         if (!route.params.stationId && newStations.length > 0) {
           await nextTick();
           map.value.fitBounds(newStations.map(s => [s.location.lat, s.location.lng]), { padding: [50, 50] });
           console.log('Map bounds adjusted after stations data update');
         }
         nextTick(() => { if(map.value) map.value.invalidateSize(); }); // Invalidate size after markers are added

    }

    // If route params changed (specifically stationId)
    if (map.value && newStationId !== oldStationId) {
        console.log('Route stationId changed:', oldStationId, '->', newStationId);
        if (newStationId) {
             const stationToSelect = stationsStore.stations.find(s => s._id === newStationId);
             if (stationToSelect) {
                selectedStation.value = stationToSelect;
                console.log('Selected station from route params on change:', stationToSelect);
                // Center map on the selected station
                map.value.setView([stationToSelect.location.lat, stationToSelect.location.lng], 15); // Zoom in a bit
                console.log('Map centered on selected station from route change');
             } else {
                console.warn('Station with ID not found on route change:', newStationId);
                selectedStation.value = null; // Clear selection if station not found
                // Optionally display an error
             }
        } else {
            // If stationId is removed from route, clear selection and maybe refit bounds to all stations
            console.log('stationId removed from route');
            selectedStation.value = null;
             if (stationsStore.stations.length > 0) {
                await nextTick();
                map.value.fitBounds(stationsStore.stations.map(s => [s.location.lat, s.location.lng]), { padding: [50, 50] });
                console.log('stationId removed, fitting bounds to all stations');
             }
             nextTick(() => { if(map.value) map.value.invalidateSize(); });
        }
    }

}, { deep: true, immediate: true }); // Deep watch for stations array changes, immediate to run on mount


const initMap = async () => {
  if (!mapContainer.value) {
    console.error('Map container is null during initMap');
    return;
  }

  try {
    console.log('Creating map instance...');
    // Create map instance with explicit type
    const mapInstance = L.map(mapContainer.value, {
      center: [40.7128, -74.006],
      zoom: 10,
      zoomControl: true
    });
    map.value = mapInstance;
    
    console.log('Adding tile layer...');
    // Add tile layer (OpenStreetMap)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });
    
    tileLayer.addTo(mapInstance);

    // Wait for the map to be ready
    await new Promise<void>(resolve => {
      mapInstance.whenReady(() => {
        console.log('Map is ready');
        mapInstance.invalidateSize();
        console.log('Map size invalidated immediately when ready');
        resolve();
      });
    });
  } catch (err) {
    console.error('Error initializing map:', err);
    error.value = 'Failed to initialize the map. Details in console.';
    throw err;
  }
};

const addStationsToMap = () => {
  if (!map.value || !stationsStore.stations) {
    console.error('Map not initialized or no stations data when adding stations');
    return;
  }
  
  try {
    console.log('Adding stations to map...');
    // Add markers for each station
    stationsStore.stations.forEach(station => {
      const { lat, lng } = station.location;
      
      // Create custom marker based on station status
      const markerIcon = L.divIcon({
        html: `<div class="station-marker ${station.status}"></div>`,
        className: '', // Keep className empty for custom styling
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map.value!);
      
      // Add click handler
      marker.on('click', () => {
        selectedStation.value = station;
      });
      
      // Add tooltip
      marker.bindTooltip(station.name, {
        permanent: false,
        direction: 'top',
        opacity: 0.9
      });
    });
    
    // Note: fitBounds/setView is now handled in the watch effect based on route params or data changes

  } catch (err) {
    console.error('Error adding stations to map:', err);
    error.value = 'Failed to display stations on the map. Details in console.';
  }
};

const handleEditStation = (id: string) => {
  router.push(`/stations/${id}/edit`);
};

const handleCloseInfo = () => {
  selectedStation.value = null;
};

// Re-invalidate size if the window is resized
// window.addEventListener('resize', () => {
//   if (map.value) {
//     map.value.invalidateSize();
//     console.log('Map size invalidated on window resize');
//   }
// });
// Note: A ResizeObserver might be more efficient in complex layouts

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Charging Stations Map</h1>
        <p class="text-gray-600 mt-1">View and interact with your charging station network</p>
      </div>
      <router-link 
        to="/stations" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        View List
      </router-link>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div class="relative parent-map-container">
       <!-- Map container - Always in DOM -->
      <div ref="mapContainer" id="map-container" class="w-full h-[80vh] rounded-lg shadow-md bg-gray-100"></div>

      <!-- Loading/Empty State Overlay -->
      <div 
        v-if="isLoadingOrEmpty && !error"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg"
      >
         <div v-if="stationsStore.loading" class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p class="mt-3 text-gray-700">Loading stations...</p>
         </div>

         <div v-else-if="stationsStore.stations.length === 0" class="text-center">
            <h2 class="text-xl font-semibold text-gray-700">No charging stations available</h2>
            <p class="text-gray-500 mt-2">Add charging stations to view them on the map</p>
            <router-link
              to="/stations/new"
              class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Your First Station
            </router-link>
         </div>
      </div>

      <!-- Station Info Overlay -->
      <div v-if="selectedStation" class="absolute bottom-4 right-4 w-80 z-20">
        <StationInfo 
          :station="selectedStation" 
          @edit="handleEditStation(selectedStation._id)" 
          @close="handleCloseInfo" 
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Parent container for relative positioning */
.parent-map-container {
  position: relative;
  width: 100%;
  min-height: 80vh; /* Match the height of the map container */
}

/* Ensure Leaflet container takes up space and is positioned correctly */
.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
}

/* Specific height for the map container element */
#map-container {
  width: 100%;
  height: 80vh; /* Viewport height */
  min-height: 80vh;
  display: block !important;
}

/* Custom marker styles */
.station-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.station-marker.active {
  background-color: #10B981; /* green-500 */
}

.station-marker.inactive {
  background-color: #6B7280; /* gray-500 */
}

.station-marker.maintenance {
  background-color: #F59E0B; /* amber-500 */
}
</style>