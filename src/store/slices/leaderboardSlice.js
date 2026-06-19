import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { leaderboardApi } from '../../services/api';

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await leaderboardApi.get();
    return data.leaderboards;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchLeaderboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default leaderboardSlice.reducer;
