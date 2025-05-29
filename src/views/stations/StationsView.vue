<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStationsStore, type StationFilters } from '../../stores/stations';
import StationCard from '../../components/stations/StationCard.vue';
import StationFiltersComponent from '../../components/stations/StationFilters.vue';

const stationsStore = useStationsStore();
const router = useRouter();

const isLoading = computed(() => stationsStore.loading);
const filters = ref<StationFilters>({});

// Load stations when component mounts
onMounted(async () => {
  await stationsStore.fetchStations();
});

const handleFilterChange = async (newFilters: StationFilters) => {
  filters.value = newFilters;
  await stationsStore.fetchStations(newFilters);
};

const handleAddNew = () => {
  router.push('/stations/new');
};

const handleEdit = (id: string) => {
  router.push(`/stations/${id}/edit`);
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this charging station?')) {
    await stationsStore.deleteStation(id);
    // Refresh the list with current filters
    await stationsStore.fetchStations(filters.value);
  }
};

// Handle viewing a station on the map
const handleViewStationOnMap = (stationId: string) => {
  router.push({ name: 'Map', params: { stationId: stationId } });
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Charging Stations</h1>
        <p class="text-gray-600 mt-1">Manage your network of EV charging stations</p>
      </div>
      <button
        @click="handleAddNew"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <span class="mr-2">+</span> Add New Station
      </button>
    </div>

    <StationFiltersComponent @filter-change="handleFilterChange" />

    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="stationsStore.stations.length === 0" class="bg-white p-12 rounded-lg shadow text-center">
      <h2 class="text-xl font-semibold text-gray-700">No charging stations found</h2>
      <p class="text-gray-500 mt-2">Try adjusting your filters or add a new charging station</p>
      <button
        @click="handleAddNew"
        class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Add Your First Station
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <StationCard
        v-for="station in stationsStore.stations"
        :key="station._id"
        :station="station"
        @edit="handleEdit(station._id)"
        @delete="handleDelete(station._id)"
        @view-on-map="handleViewStationOnMap(station._id)"
      />
    </div>
  </div>
</template>