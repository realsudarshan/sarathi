import { create } from "zustand";

import { DriverStore, LocationStore, MarkerData, Ride } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

export const useRideStore = create<{
  activeRide: Ride | null;
  setActiveRide: (ride: Ride) => void;
  updateRideLocation: (latitude: number, longitude: number) => void;
  clearActiveRide: () => void;
}>((set) => ({
  activeRide: null,
  setActiveRide: (ride: Ride) => set(() => ({ activeRide: ride })),
  updateRideLocation: (latitude: number, longitude: number) =>
    set((state) => ({
      activeRide: state.activeRide
        ? {
            ...state.activeRide,
            current_latitude: latitude,
            current_longitude: longitude,
          }
        : null,
    })),
  clearActiveRide: () => set(() => ({ activeRide: null })),
}));