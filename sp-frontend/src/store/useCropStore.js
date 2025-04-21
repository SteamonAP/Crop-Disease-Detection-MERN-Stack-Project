import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const useCropStore = create((set, get) => ({
  availableCrops: [],
  selectedCrop: null,
  isLoading: false,
  error: null,

  // Fetch all available crops
  fetchAvailableCrops: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/crop/crops');
      if (response.data.success) {
        set({ availableCrops: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch available crops', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch available crops', 
        isLoading: false 
      });
    }
  },

  // Fetch details for a specific crop
  fetchCropDetails: async (cropName) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/crop/crops/${cropName}`);
      if (response.data.success) {
        set({ selectedCrop: response.data.data, isLoading: false });
      } else {
        set({ 
          error: response.data.message || `Failed to fetch details for ${cropName}`, 
          selectedCrop: null, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || `Failed to fetch details for ${cropName}`, 
        selectedCrop: null, 
        isLoading: false 
      });
    }
  },

  // Clear selected crop
  clearSelectedCrop: () => {
    set({ selectedCrop: null });
  }
}));

export default useCropStore; 