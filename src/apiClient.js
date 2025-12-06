import axios from "axios";

const api = axios.create({
  baseURL: "https://zerotohire.onrender.com/api"
});

export default api;
