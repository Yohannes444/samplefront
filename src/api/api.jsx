import { Password } from "@mui/icons-material";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_VITE_API_URL, // Initial empty baseURL
  headers: {
    "Content-Type": "application/json", // Add Accept header for application/json
  },
});


   // "typescript": "5.6.0-dev.20240620",
    // "typescript-eslint": "8.3.0",
// Function to set the Authorization header for requests requiring authentication
export const setAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Function to post user data
export const postUser = async (userData) => {
  try {
    setAuthHeaders();
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error posting user:", error.message);
    throw new Error("Failed to post user");
  }
};

// Function to login user
export const loginUser = async (loginData) => {
  try {
    const data= {
      phoneNumber:loginData.email,
      Password: loginData.password
    }
    console.log("loginData",loginData)

    const response = await api.post(`/user/login`, data);
    const { token } = response.data;
    localStorage.setItem("token", token);
    setAuthHeaders(); // Set authorization header
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error("Failed to login");
  }
};
