import axioss from "axios";

// export const API_URL = "http://15.206.61.14/api/v1/"; //live/
// export const API_URL = "http://192.168.3.217:4001/api/v1/"; //abdullah/
export const API_URL = "http://182.176.88.214:2321/api/v1/"; //Live/

const axios = axioss.create({
  baseURL: API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "ngrok-skip-browser-warning": true,
  },
});

export default axios;
