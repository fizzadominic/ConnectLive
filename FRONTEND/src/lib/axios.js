import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";
 const axiosInstance = axios.create({
   baseURL:import.meta.env.MODE==="development" ? "http://localhost:3000/api" : "/api",
   withCredentials:true
});

export default axiosInstance;

