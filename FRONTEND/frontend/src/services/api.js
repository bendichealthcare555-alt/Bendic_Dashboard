import axios from "axios";

const api = axios.create({
  baseURL: "https://bendic-dashboard.onrender.com",
  
});

export default api;
