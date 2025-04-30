
export interface RideData {
  id: string;
  name: string;
  description: string;
  destination: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  startTime: string;
  endTime?: string;
  status: "active" | "completed";
  locationLink?: string;
}

export type RideFormData = Omit<RideData, "id" | "startTime" | "status" | "locationLink" | "endTime">;
