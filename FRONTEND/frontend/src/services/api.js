import axios from "axios";

const api = axios.create({
  baseURL: "https://bendic-dashboard-api.onrender.com",
  
});

export default api;
