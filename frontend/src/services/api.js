import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://travelverse-qk4d.vercel.app";

// Attach token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API calls & Aliases
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const register = registerUser;
export const login = loginUser;

// Destinations API calls
export const fetchDestinations = async () => {
  const response = await API.get('/destinations');
  return response.data;
};

// Trips API calls
export const createTrip = async (tripData) => {
  const response = await API.post('/trips', tripData);
  return response.data;
};

export const getUserTrips = async (userId) => {
  const response = await API.get(`/trips/user/${userId}`);
  return response;
};

export const updateTrip = async (tripId, tripData) => {
  const response = await API.put(`/trips/${tripId}`, tripData);
  return response.data;
};

export const deleteTrip = async (tripId) => {
  const response = await API.delete(`/trips/${tripId}`);
  return response.data;
};

// Bookings API calls
export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async (userId) => {
  const response = await API.get(`/bookings/user/${userId}`);
  return response;
};

// Expenses API calls
export const createExpense = async (expenseData) => {
  const response = await API.post('/expenses', expenseData);
  return response.data;
};

export const getTripExpenses = async (tripId) => {
  const response = await API.get(`/expenses/trip/${tripId}`);
  return response;
};

export const deleteExpense = async (expenseId) => {
  const response = await API.delete(`/expenses/${expenseId}`);
  return response.data;
};

// AI Itinerary & Estimation API calls (Using configured 'API' instance instead of undefined API_BASE)
export const generateAiItinerary = async (tripData) => {
  const response = await API.post('/ai/generate-itinerary', tripData);
  return response;
};

export const getAiTripEstimate = async (estimateData) => {
  const response = await API.post('/ai/estimate-trip', estimateData);
  return response;
};

export default API;
