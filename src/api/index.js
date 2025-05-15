const API_URL = process.env.REACT_APP_API_URL || "https://fire-h0u2.onrender.com";

// API endpoints
const ENDPOINTS = {
  SENSOR: API_URL + "/api/sensor/",
  SENSOR_ALL: API_URL + "/api/sensor/all/",
  MAP: API_URL + "/api/map/",
  STATS: API_URL + "/api/stats/",
  ACCIDENTS: API_URL + "/api/accidents/",
};

async function fetchFromAPI(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error("API error: " + response.status + " " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      // Suppress abort errors as they are expected during fetch cancellation
      console.log("Fetch aborted");
      return;
    }
    console.error("API request failed:", error);
    throw error;
  }
}

// API functions
const api = {
  // Get the latest sensor data
  getLatestSensorData: (signal) => fetchFromAPI(ENDPOINTS.SENSOR, { signal }),

  // Get all sensor data
  getAllSensorData: () => fetchFromAPI(ENDPOINTS.SENSOR_ALL),

  // Get map data (accident locations)
  getMapData: () => fetchFromAPI(ENDPOINTS.MAP),

  // Get statistics
  getStats: () => fetchFromAPI(ENDPOINTS.STATS),

  // Get accident events
  getAccidents: () => fetchFromAPI(ENDPOINTS.ACCIDENTS),

  // Send sensor data (from ESP32)
  sendSensorData: (data) =>
    fetchFromAPI(ENDPOINTS.SENSOR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "safedrive_secret_key",
      },
      body: JSON.stringify(data),
    }),

  // Download report (returns blob)
  downloadReport: async (reportPath) => {
    const response = await fetch(API_URL + reportPath);
    if (!response.ok) {
      throw new Error("Failed to download report");
    }
    return response.blob();
  },
};

export default api;
