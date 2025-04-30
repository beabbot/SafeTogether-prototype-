
import { RideData, RideFormData } from "./types";

const STORAGE_KEY = "safetogether-current-ride";

export const saveRide = (rideData: RideFormData): RideData => {
  const rideId = crypto.randomUUID();
  const startTime = new Date().toISOString();
  
  const newRide: RideData = {
    id: rideId,
    ...rideData,
    startTime,
    status: "active",
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRide));
  return newRide;
};

export const getCurrentRide = (): RideData | null => {
  const rideData = localStorage.getItem(STORAGE_KEY);
  if (!rideData) return null;
  
  try {
    return JSON.parse(rideData);
  } catch (e) {
    console.error("Failed to parse ride data:", e);
    return null;
  }
};

export const updateRideLocation = (locationLink: string): RideData | null => {
  const currentRide = getCurrentRide();
  if (!currentRide) return null;
  
  const updatedRide: RideData = {
    ...currentRide,
    locationLink
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRide));
  return updatedRide;
};

export const completeRide = (): RideData | null => {
  const currentRide = getCurrentRide();
  if (!currentRide) return null;
  
  const completedRide: RideData = {
    ...currentRide,
    status: "completed",
    endTime: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedRide));
  return completedRide;
};

export const clearRide = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
