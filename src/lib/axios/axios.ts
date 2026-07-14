import axios from "axios";
const api = axios.create({
  baseURL: '/api', // This will be proxied to the backend as per next.config.ts
  withCredentials: true, // Include cookies in requests
});


export { api as axios };
