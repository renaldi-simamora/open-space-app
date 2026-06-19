import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { threadsApi, usersApi } from '../../services/api';

export const fetchThreads = createAsyncThunk('threads/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await threadsApi.getAll();
    return data.threads;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchUsers = createAsyncThunk('threads/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const data = await usersApi.getAll();
    return data.users;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createThread = createAsyncThunk('threads/create', async ({ title, body, category }, { rejectWithValue }) => {
  try {
    const data = await threadsApi.create(title, body, category);
    return data.thread;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteThread = createAsyncThunk('threads/upVote', async ({ threadId, userId }, { rejectWithValue }) => {
  try {
    await threadsApi.upVote(threadId);
    return { threadId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteThread = createAsyncThunk('threads/downVote', async ({ threadId, userId }, { rejectWithValue }) => {
  try {
    await threadsApi.downVote(threadId);
    return { threadId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteThread = createAsyncThunk('threads/neutralVote', async ({ threadId, userId }, { rejectWithValue }) => {
  try {
    await threadsApi.neutralVote(threadId);
    return { threadId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const applyVote = (thread, userId, voteType) => {
  thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
  thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
  if (voteType === 'up') thread.upVotesBy.push(userId);
  if (voteType === 'down') thread.downVotesBy.push(userId);
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    users: [],
    loading: false,
    error: null,
    categoryFilter: '',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    optimisticUpVote(state, action) {
      const { threadId, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (thread) applyVote(thread, userId, thread.upVotesBy.includes(userId) ? 'neutral' : 'up');
    },
    optimisticDownVote(state, action) {
      const { threadId, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (thread) applyVote(thread, userId, thread.downVotesBy.includes(userId) ? 'neutral' : 'down');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchThreads.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchThreads.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(createThread.fulfilled, (state, action) => { state.items.unshift(action.payload); });
  },
});

export const { setCategoryFilter, optimisticUpVote, optimisticDownVote } = threadsSlice.actions;
export default threadsSlice.reducer;
