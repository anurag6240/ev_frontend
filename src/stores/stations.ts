import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import { toast } from 'vue3-toastify';

export interface Location {
  lat: number;
  lng: number;
}

export interface ChargingStation {
  _id: string;
  name: string;
  location: Location;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  powerOutput: number;
  connectorType: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface StationFilters {
  status?: string;
  connectorType?: string;
  minPower?: number;
  maxPower?: number;
}

export const useStationsStore = defineStore('stations', () => {
  const stations = ref<ChargingStation[]>([]);
  const currentStation = ref<ChargingStation | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get all stations with optional filters
  async function fetchStations(filters: StationFilters = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.connectorType) params.append('connectorType', filters.connectorType);
      if (filters.minPower) params.append('minPower', filters.minPower.toString());
      if (filters.maxPower) params.append('maxPower', filters.maxPower.toString());
      
      const response = await api.get(`/stations?${params.toString()}`);
      stations.value = response.data.data;
      return response.data.data;
    } catch (err: Error) {
      const message = err.message || 'Failed to fetch stations';
      error.value = message;
      toast.error(message);
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Get station by ID
  async function fetchStationById(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/stations/${id}`);
      currentStation.value = response.data.data;
      return response.data.data;
    } catch (err: Error) {
      const message = err.message || 'Failed to fetch station details';
      error.value = message;
      toast.error(message);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Create new station
  async function createStation(stationData: Omit<ChargingStation, '_id' | 'owner' | 'createdAt' | 'updatedAt'>) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/stations', stationData);
      toast.success('Charging station created successfully');
      return response.data.data;
    } catch (err: Error) {
      const message = err.message || 'Failed to create station';
      error.value = message;
      toast.error(message);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Update station
  async function updateStation(id: string, stationData: Partial<ChargingStation>) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.put(`/stations/${id}`, stationData);
      toast.success('Charging station updated successfully');
      return response.data.data;
    } catch (err: Error) {
      const message = err.message || 'Failed to update station';
      error.value = message;
      toast.error(message);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Delete station
  async function deleteStation(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete(`/stations/${id}`);
      stations.value = stations.value.filter(station => station._id !== id);
      toast.success('Charging station deleted successfully');
      return true;
    } catch (err: Error) {
      const message = err.message || 'Failed to delete station';
      error.value = message;
      toast.error(message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    stations,
    currentStation,
    loading,
    error,
    fetchStations,
    fetchStationById,
    createStation,
    updateStation,
    deleteStation
  };
});