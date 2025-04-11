import axios from "axios";
import { toast } from "react-hot-toast";

// For backend API calls
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// For ML model server calls
export const mlAxiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:10000" : "/ml",
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different error statuses
      switch (error.response.status) {
        case 401:
          toast.error("Please login to continue");
          break;
        case 403:
          toast.error("You don't have permission to access this resource");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 500:
          toast.error("Server error. Please try again later");
          break;
        default:
          toast.error(error.response.data?.message || "Something went wrong");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("No response from server. Please check your connection");
    } else {
      // Something happened in setting up the request
      toast.error("Error setting up request");
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for ML instance
mlAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data?.message || "Prediction failed");
    } else if (error.request) {
      toast.error("No response from ML server. Please try again");
    } else {
      toast.error("Error setting up prediction request");
    }
    return Promise.reject(error);
  }
);