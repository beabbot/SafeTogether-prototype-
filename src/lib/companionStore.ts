
import { CompanionRequest, CompanionMatch, Message } from "./types";
import { v4 as uuidv4 } from "uuid";

// Local storage keys
const COMPANION_REQUESTS_KEY = "safeTogetherCompanionRequests";
const COMPANION_MATCHES_KEY = "safeTogetherCompanionMatches";

// Get all companion requests
export const getAllCompanionRequests = (): CompanionRequest[] => {
  const requests = localStorage.getItem(COMPANION_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
};

// Get a specific companion request
export const getCompanionRequest = (id: string): CompanionRequest | undefined => {
  const requests = getAllCompanionRequests();
  return requests.find(request => request.id === id);
};

// Create a new companion request
export const createCompanionRequest = (requestData: Omit<CompanionRequest, "id" | "status" | "createdAt">): CompanionRequest => {
  const newRequest: CompanionRequest = {
    id: uuidv4(),
    ...requestData,
    status: "waiting",
    createdAt: new Date().toISOString()
  };
  
  const requests = getAllCompanionRequests();
  localStorage.setItem(COMPANION_REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
  
  return newRequest;
};

// Get all companion matches
export const getAllCompanionMatches = (): CompanionMatch[] => {
  const matches = localStorage.getItem(COMPANION_MATCHES_KEY);
  return matches ? JSON.parse(matches) : [];
};

// Get a specific match
export const getCompanionMatch = (requestId: string): CompanionMatch | undefined => {
  const matches = getAllCompanionMatches();
  return matches.find(match => match.requestId === requestId);
};

// Create a new companion match
export const createCompanionMatch = (requestId: string, companionName: string): CompanionMatch => {
  const request = getCompanionRequest(requestId);
  
  if (!request) {
    throw new Error("Companion request not found");
  }
  
  // Update request status
  const requests = getAllCompanionRequests();
  const updatedRequests = requests.map(r => 
    r.id === requestId ? { ...r, status: "matched" } : r
  );
  localStorage.setItem(COMPANION_REQUESTS_KEY, JSON.stringify(updatedRequests));
  
  // Create match
  const newMatch: CompanionMatch = {
    requestId: requestId,
    companionId: uuidv4(),
    companionName: companionName,
    requestName: request.name,
    messages: [],
    createdAt: new Date().toISOString()
  };
  
  const matches = getAllCompanionMatches();
  localStorage.setItem(COMPANION_MATCHES_KEY, JSON.stringify([...matches, newMatch]));
  
  return newMatch;
};

// Add a message to a match
export const addMessageToMatch = (
  requestId: string, 
  content: string, 
  senderIsCompanion: boolean
): Message | undefined => {
  const matches = getAllCompanionMatches();
  const matchIndex = matches.findIndex(match => match.requestId === requestId);
  
  if (matchIndex === -1) {
    return undefined;
  }
  
  const match = matches[matchIndex];
  const newMessage: Message = {
    id: uuidv4(),
    senderId: senderIsCompanion ? match.companionId : match.requestId,
    senderName: senderIsCompanion ? match.companionName : match.requestName,
    content,
    timestamp: new Date().toISOString()
  };
  
  const updatedMatch = {
    ...match,
    messages: [...match.messages, newMessage]
  };
  
  matches[matchIndex] = updatedMatch;
  localStorage.setItem(COMPANION_MATCHES_KEY, JSON.stringify(matches));
  
  return newMessage;
};

// Get waiting companion requests
export const getWaitingCompanionRequests = (): CompanionRequest[] => {
  return getAllCompanionRequests().filter(request => request.status === "waiting");
};

// Check if user has an active request
export const hasActiveRequest = (name: string): boolean => {
  const requests = getAllCompanionRequests();
  return requests.some(request => request.name === name && request.status === "waiting");
};
