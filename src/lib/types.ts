
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

export interface CompanionRequest {
  id: string;
  name: string;
  currentLocation: string;
  destination: string;
  departureTime: string;
  notes?: string;
  status: "waiting" | "matched";
  createdAt: string;
}

export type CompanionRequestFormData = Omit<CompanionRequest, "id" | "status" | "createdAt">;

export interface CompanionMatch {
  requestId: string;
  companionId: string;
  companionName: string;
  requestName: string;
  messages: Message[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}
