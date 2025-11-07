// server/utils/http.js
import axios from "axios";
import http from "http";
import https from "https";

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

const httpClient = axios.create({
  timeout: 15000,
  maxRedirects: 0,
  httpAgent,
  httpsAgent,
  headers: { "User-Agent": "SunshineHotel-Server/1.0" }
});

// Optional logging/error normalization
httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data || err.message;
    // You can add centralized logging here
    return Promise.reject(new Error(`[HTTP ${status || "ERR"}] ${msg}`));
  }
);

export default httpClient;