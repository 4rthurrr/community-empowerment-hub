import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get reviews
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/reviews/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch reviews",
      });
    }
  }
);

// Add review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (reviewData, thunkAPI) => {
    try {
      const response = await axios.post("/api/reviews", reviewData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to add review",
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch reviews";
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add review";
      });
  },
});

export default reviewSlice.reducer;
