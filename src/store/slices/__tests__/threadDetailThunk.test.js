/**
 * Thunk function tests for threadDetailSlice async actions
 *
 * Test scenarios:
 * 1. fetchThreadDetail should dispatch fulfilled with thread data on success
 * 2. fetchThreadDetail should dispatch rejected with error message on failure
 * 3. createComment should dispatch fulfilled with new comment on success
 * 4. createComment should dispatch rejected with error message on failure
 * 5. upVoteDetailThread should dispatch fulfilled on success
 * 6. upVoteDetailThread should dispatch rejected on failure
 * 7. downVoteDetailThread should dispatch fulfilled on success
 * 8. neutralVoteDetailThread should dispatch fulfilled on success
 * 9. upVoteComment should dispatch fulfilled with commentId and userId on success
 * 10. upVoteComment should dispatch rejected on failure
 * 11. downVoteComment should dispatch fulfilled on success
 * 12. neutralVoteComment should dispatch fulfilled on success
 */

import { configureStore } from '@reduxjs/toolkit';
import threadDetailReducer, {
  fetchThreadDetail,
  createComment,
  upVoteDetailThread,
  downVoteDetailThread,
  neutralVoteDetailThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../threadDetailSlice';
import * as api from '../../../services/api';

jest.mock('../../../services/api');

const buildStore = () => configureStore({
  reducer: { threadDetail: threadDetailReducer },
});

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread Detail',
  body: '<p>Body</p>',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-2', name: 'Bob', avatar: '' },
  comments: [],
};

const mockComment = {
  id: 'comment-1',
  content: '<p>Great post!</p>',
  createdAt: '2024-01-01T01:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'Alice', avatar: '' },
};

describe('threadDetailSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: fetchThreadDetail success
  it('fetchThreadDetail should dispatch fulfilled with thread data on success', async () => {
    api.threadsApi.getDetail = jest.fn().mockResolvedValue({ detailThread: mockThread });

    const store = buildStore();
    await store.dispatch(fetchThreadDetail('thread-1'));

    const state = store.getState().threadDetail;
    expect(state.thread).toEqual(mockThread);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Test 2: fetchThreadDetail failure
  it('fetchThreadDetail should dispatch rejected with error message on failure', async () => {
    api.threadsApi.getDetail = jest.fn().mockRejectedValue(new Error('Thread not found'));

    const store = buildStore();
    await store.dispatch(fetchThreadDetail('thread-999'));

    const state = store.getState().threadDetail;
    expect(state.thread).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Thread not found');
  });

  // Test 3: createComment success
  it('createComment should dispatch fulfilled with new comment on success', async () => {
    api.commentsApi.create = jest.fn().mockResolvedValue({ comment: mockComment });

    const store = buildStore();
    // Pre-populate thread in store
    await store.dispatch({
      type: fetchThreadDetail.fulfilled.type,
      payload: { ...mockThread, comments: [] },
    });
    await store.dispatch(createComment({ threadId: 'thread-1', content: '<p>Great post!</p>' }));

    const state = store.getState().threadDetail;
    expect(state.thread.comments[0]).toEqual(mockComment);
  });

  // Test 4: createComment failure
  it('createComment should dispatch rejected with error message on failure', async () => {
    api.commentsApi.create = jest.fn().mockRejectedValue(new Error('Unauthorized to comment'));

    const store = buildStore();
    const result = await store.dispatch(createComment({ threadId: 'thread-1', content: 'Hello' }));

    expect(result.type).toBe(createComment.rejected.type);
    expect(result.payload).toBe('Unauthorized to comment');
  });

  // Test 5: upVoteDetailThread success
  it('upVoteDetailThread should dispatch fulfilled on success', async () => {
    api.threadsApi.upVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(upVoteDetailThread({ threadId: 'thread-1' }));

    expect(result.type).toBe(upVoteDetailThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1' });
  });

  // Test 6: upVoteDetailThread failure
  it('upVoteDetailThread should dispatch rejected on failure', async () => {
    api.threadsApi.upVote = jest.fn().mockRejectedValue(new Error('Forbidden'));

    const store = buildStore();
    const result = await store.dispatch(upVoteDetailThread({ threadId: 'thread-1' }));

    expect(result.type).toBe(upVoteDetailThread.rejected.type);
    expect(result.payload).toBe('Forbidden');
  });

  // Test 7: downVoteDetailThread success
  it('downVoteDetailThread should dispatch fulfilled on success', async () => {
    api.threadsApi.downVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(downVoteDetailThread({ threadId: 'thread-1' }));

    expect(result.type).toBe(downVoteDetailThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1' });
  });

  // Test 8: neutralVoteDetailThread success
  it('neutralVoteDetailThread should dispatch fulfilled on success', async () => {
    api.threadsApi.neutralVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(neutralVoteDetailThread({ threadId: 'thread-1' }));

    expect(result.type).toBe(neutralVoteDetailThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1' });
  });

  // Test 9: upVoteComment success
  it('upVoteComment should dispatch fulfilled with commentId and userId on success', async () => {
    api.commentsApi.upVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(
      upVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
    );

    expect(result.type).toBe(upVoteComment.fulfilled.type);
    expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
  });

  // Test 10: upVoteComment failure
  it('upVoteComment should dispatch rejected on failure', async () => {
    api.commentsApi.upVote = jest.fn().mockRejectedValue(new Error('Vote failed'));

    const store = buildStore();
    const result = await store.dispatch(
      upVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
    );

    expect(result.type).toBe(upVoteComment.rejected.type);
    expect(result.payload).toBe('Vote failed');
  });

  // Test 11: downVoteComment success
  it('downVoteComment should dispatch fulfilled on success', async () => {
    api.commentsApi.downVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(
      downVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
    );

    expect(result.type).toBe(downVoteComment.fulfilled.type);
    expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
  });

  // Test 12: neutralVoteComment success
  it('neutralVoteComment should dispatch fulfilled on success', async () => {
    api.commentsApi.neutralVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(
      neutralVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
    );

    expect(result.type).toBe(neutralVoteComment.fulfilled.type);
    expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
  });
});
