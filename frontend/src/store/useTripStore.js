import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useTripStore = create((set, get) => ({
  trips: [],
  isTripsLoading: false,
  isTripSubmitting: false,
  selectedTrip: null,

  // Fetch all trips
  getTrips: async () => {
    set({ isTripsLoading: true });
    try {
      const res = await axiosInstance.get("/trips");
      set({ trips: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch trips");
    } finally {
      set({ isTripsLoading: false });
    }
  },

  // Create a new trip
  createTrip: async (tripData) => {
    set({ isTripSubmitting: true });
    try {
      const res = await axiosInstance.post("/trips", tripData);
      set((state) => ({ trips: [...state.trips, res.data] }));
      toast.success("Trip created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create trip");
      throw error;
    } finally {
      set({ isTripSubmitting: false });
    }
  },

  // Update a trip
  updateTrip: async (id, tripData) => {
    set({ isTripSubmitting: true });
    try {
      const res = await axiosInstance.put(`/trips/${id}`, tripData);
      set((state) => ({
        trips: state.trips.map((trip) => 
          trip._id === id ? res.data : trip
        ),
        selectedTrip: state.selectedTrip?._id === id ? res.data : state.selectedTrip
      }));
      toast.success("Trip updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update trip");
      throw error;
    } finally {
      set({ isTripSubmitting: false });
    }
  },

  // Delete a trip
  deleteTrip: async (id) => {
    set({ isTripSubmitting: true });
    try {
      await axiosInstance.delete(`/trips/${id}`);
      set((state) => ({
        trips: state.trips.filter((trip) => trip._id !== id),
        selectedTrip: state.selectedTrip?._id === id ? null : state.selectedTrip
      }));
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete trip");
      throw error;
    } finally {
      set({ isTripSubmitting: false });
    }
  },

  // Set selected trip
  setSelectedTrip: (trip) => {
    set({ selectedTrip: trip });
  },

  // Clear selected trip
  clearSelectedTrip: () => {
    set({ selectedTrip: null });
  }
}));
