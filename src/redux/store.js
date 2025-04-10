import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import cryptoReducer from "./slices/cryptoSlice";

import preferencesReducer from "./slices/preferencesSlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    
    preferences: preferencesReducer, // Add preferences slice
  },
});

export default store;