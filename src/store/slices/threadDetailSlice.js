import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { threadsApi, commentsApi } from '../../services/api';

export const fetchThreadDetail = createAsyncThunk('threadDetail/fetch', async (threadId, { rejectWithValue }) => {
  try {
    const data = await threadsApi.getDetail(threadId);
    return data.detailThread;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createComment = createAsyncThunk('threadDetail/createComment', async ({ threadId, content }, { rejectWithValue }) => {
  try {
    const data = await commentsApi.create(threadId, content);
    return data.comment;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteDetailThread = createAsyncThunk('threadDetail/upVote', async ({ threadId }, { rejectWithValue }) => {
  try {
    await threadsApi.upVote(threadId);
    return { threadId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteDetailThread = createAsyncThunk('threadDetail/downVote', async ({ threadId }, { rejectWithValue }) => {
  try {
    await threadsApi.downVote(threadId);
    return { threadId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteDetailThread = createAsyncThunk('threadDetail/neutralVote', async ({ threadId }, { rejectWithValue }) => {
  try {
    await threadsApi.neutralVote(threadId);
    return { threadId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteComment = createAsyncThunk('threadDetail/upVoteComment', async ({ threadId, commentId, userId }, { rejectWithValue }) => {
  try {
    await commentsApi.upVote(threadId, commentId);
    return { commentId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteComment = createAsyncThunk('threadDetail/downVoteComment', async ({ threadId, commentId, userId }, { rejectWithValue }) => {
  try {
    await commentsApi.downVote(threadId, commentId);
    return { commentId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteComment = createAsyncThunk('threadDetail/neutralVoteComment', async ({ threadId, commentId, userId }, { rejectWithValue }) => {
  try {
    await commentsApi.neutralVote(threadId, commentId);
    return { commentId, userId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const applyCommentVote = (comment, userId, voteType) => {
  comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
  comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
  if (voteType === 'up') comment.upVotesBy.push(userId);
  if (voteType === 'down') comment.downVotesBy.push(userId);
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    loading: false,
    error: null,
  },
  reducers: {
    optimisticUpVoteComment(state, action) {
      const { commentId, userId } = action.payload;
      const comment = state.thread?.comments.find((c) => c.id === commentId);
      if (comment) applyCommentVote(comment, userId, comment.upVotesBy.includes(userId) ? 'neutral' : 'up');
    },
    optimisticDownVoteComment(state, action) {
      const { commentId, userId } = action.payload;
      const comment = state.thread?.comments.find((c) => c.id === commentId);
      if (comment) applyCommentVote(comment, userId, comment.downVotesBy.includes(userId) ? 'neutral' : 'down');
    },
    optimisticUpVoteThread(state, action) {
      const { userId } = action.payload;
      if (!state.thread) return;
      const t = state.thread;
      t.upVotesBy = t.upVotesBy.filter((id) => id !== userId);
      t.downVotesBy = t.downVotesBy.filter((id) => id !== userId);
      if (!t.upVotesBy.includes(userId)) t.upVotesBy.push(userId);
    },
    optimisticDownVoteThread(state, action) {
      const { userId } = action.payload;
      if (!state.thread) return;
      const t = state.thread;
      t.upVotesBy = t.upVotesBy.filter((id) => id !== userId);
      t.downVotesBy = t.downVotesBy.filter((id) => id !== userId);
      if (!t.downVotesBy.includes(userId)) t.downVotesBy.push(userId);
    },
    optimisticNeutralVoteThread(state, action) {
      const { userId } = action.payload;
      if (!state.thread) return;
      state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
      state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.thread = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.thread) state.thread.comments.unshift(action.payload);
      });
  },
});

export const {
  optimisticUpVoteComment,
  optimisticDownVoteComment,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticNeutralVoteThread,
} = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
