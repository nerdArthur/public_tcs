import axios from "axios";

// export const BASE_URL = "http://localhost:3000/whats";
export const BASE_URL = "http://backend.local/whats";

export const api = axios.create({ baseURL: BASE_URL });
