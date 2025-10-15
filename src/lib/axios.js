import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "https://videochat-backend-zuzl.onrender.com/api",
  withCredentials: true,
});
