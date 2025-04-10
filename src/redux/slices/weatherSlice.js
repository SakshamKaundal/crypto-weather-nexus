import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock WebSocket implementation
let mockWebSocketInterval = null;

const connectMockWebSocket = (dispatch) => {
  console.log('Mock WebSocket Connected');
  
  // Clear any existing interval
  if (mockWebSocketInterval) {
    clearInterval(mockWebSocketInterval);
  }
  
  // Simulate WebSocket connection
  mockWebSocketInterval = setInterval(() => {
    // Generate random weather alerts
    const alerts = [
      {
        id: Date.now(),
        type: 'warning',
        message: 'Heavy rain expected in the next hour',
        location: 'Current Location',
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now(),
        type: 'danger',
        message: 'Severe thunderstorm warning',
        location: 'Current Location',
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now(),
        type: 'info',
        message: 'Temperature dropping rapidly',
        location: 'Current Location',
        timestamp: new Date().toISOString()
      }
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    dispatch(addWeatherAlert(randomAlert));
    
    // Auto-remove the alert after 5 seconds
    setTimeout(() => {
      dispatch(removeWeatherAlert(randomAlert.id));
    }, 5000);
  }, 30000); // Generate a random alert every 30 seconds
  
  return () => {
    if (mockWebSocketInterval) {
      clearInterval(mockWebSocketInterval);
      console.log('Mock WebSocket Disconnected');
    }
  };
};

// Default cities to show on initial load
const defaultCities = [
  { name: "London", id: "2643743" },
  { name: "New York", id: "5128581" },
  { name: "Tokyo", id: "1850147" },
  { name: "Paris", id: "2988507" },
  { name: "Dubai", id: "292223" },
];

export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async (cities = defaultCities) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("OpenWeather API key is not configured");
      }

      const responses = await Promise.all(
        cities.map(async (city) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${apiKey}`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch weather for ${city.name}`);
          }
          
          return response.json();
        })
      );
      
      return responses;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch weather data");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weatherData: [],
    loading: false,
    error: null,
    alerts: [],
    wsConnected: false
  },
  reducers: {
    addWeatherAlert: (state, action) => {
      state.alerts = [action.payload, ...state.alerts].slice(0, 3); // Keep only last 3 alerts
    },
    removeWeatherAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    setWsConnected: (state, action) => {
      state.wsConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.weatherData = [];
      });
  },
});

export const {
  addWeatherAlert,
  removeWeatherAlert,
  setWsConnected,
  setError
} = weatherSlice.actions;

export const initializeWebSocket = () => (dispatch) => {
  const cleanup = connectMockWebSocket(dispatch);
  dispatch(setWsConnected(true));
  return cleanup;
};

export default weatherSlice.reducer;