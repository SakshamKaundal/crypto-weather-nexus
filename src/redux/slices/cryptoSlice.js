import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCryptoData = createAsyncThunk(
  "crypto/fetchCryptoData",
  async (cryptos) => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(
        ","
      )}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
    );
    const data = await response.json();
    return data;
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch cryptocurrency data.";
      });
  },
});

export default cryptoSlice.reducer;