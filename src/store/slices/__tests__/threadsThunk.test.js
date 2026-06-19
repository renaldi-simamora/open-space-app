/**
 * Thunk function tests for threadsSlice async actions
 *
 * Test scenarios:
 * 1. fetchThreads should dispatch fulfilled with threads data on success
 * 2. fetchThreads should dispatch rejected with error message on failure
 * 3. fetchUsers should dispatch fulfilled with users data on success
 * 4. fetchUsers should dispatch rejected with error message on failure
 * 5. createThread should dispatch fulfilled with new thread on success
 * 6. createThread should dispatch rejected with error message on failure
 * 7. upVoteThread should dispatch fulfilled with threadId and userId on success
 * 8. upVoteThread should dispatch rejected when API call fails
 * 9. downVoteThread should dispatch fulfilled with threadId and userId on success
 * 10. neutralVoteThread should dispatch fulfilled with threadId and userId on success
 */

import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, {
  fetchThreads,
  fetchUsers,
  createThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../threadsSlice';
import * as api from '../../../services/api';

jest.mock('../../../services/api');

const buildStore = () => configureStore({
  reducer: { threads: threadsReducer },
});

const mockThreads = [
  {
    id: 'thread-1',
    title: 'Thread One',
    body: '<p>Body</p>',
    category: 'general',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 3,
  },
  {
    id: 'thread-2',
    title: 'Thread Two',
    body: '<p>Body two</p>',
    category: 'react',
    createdAt: '2024-01-02T00:00:00.000Z',
    ownerId: 'user-2',
    upVotesBy: ['user-1'],
    downVotesBy: [],
    totalComments: 1,
  },
];

const mockUsers = [
  { id: 'user-1', name: 'Alice', email: 'alice@example.com', avatar: '' },
  { id: 'user-2', name: 'Bob', email: 'bob@example.com', avatar: '' },
];

describe('threadsSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: fetchThreads success
  it('fetchThreads should dispatch fulfilled with threads data on success', async () => {
    api.threadsApi.getAll = jest.fn().mockResolvedValue({ threads: mockThreads });

    const store = buildStore();
    await store.dispatch(fetchThreads());

    const state = store.getState().threads;
    expect(state.items).toEqual(mockThreads);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Test 2: fetchThreads failure
  it('fetchThreads should dispatch rejected with error message on failure', async () => {
    api.threadsApi.getAll = jest.fn().mockRejectedValue(new Error('Network error'));

    const store = buildStore();
    await store.dispatch(fetchThreads());

    const state = store.getState().threads;
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  // Test 3: fetchUsers success
  it('fetchUsers should dispatch fulfilled with users data on success', async () => {
    api.usersApi.getAll = jest.fn().mockResolvedValue({ users: mockUsers });

    const store = buildStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().threads;
    expect(state.users).toEqual(mockUsers);
  });

  // Test 4: fetchUsers failure
  it('fetchUsers should dispatch rejected with error message on failure', async () => {
    api.usersApi.getAll = jest.fn().mockRejectedValue(new Error('Failed to fetch users'));

    const store = buildStore();
    const result = await store.dispatch(fetchUsers());

    expect(result.type).toBe(fetchUsers.rejected.type);
    expect(result.payload).toBe('Failed to fetch users');
  });

  // Test 5: createThread success
  it('createThread should dispatch fulfilled with new thread on success', async () => {
    const newThread = {
      id: 'thread-new',
      title: 'New Thread',
      body: '<p>New body</p>',
      category: 'coding',
      createdAt: new Date().toISOString(),
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };
    api.threadsApi.create = jest.fn().mockResolvedValue({ thread: newThread });

    const store = buildStore();
    const result = await store.dispatch(createThread({
      title: 'New Thread',
      body: '<p>New body</p>',
      category: 'coding',
    }));

    expect(result.type).toBe(createThread.fulfilled.type);
    expect(result.payload).toEqual(newThread);
    expect(store.getState().threads.items[0]).toEqual(newThread);
  });

  // Test 6: createThread failure
  it('createThread should dispatch rejected with error message on failure', async () => {
    api.threadsApi.create = jest.fn().mockRejectedValue(new Error('Unauthorized'));

    const store = buildStore();
    const result = await store.dispatch(createThread({
      title: 'Thread',
      body: 'Body',
      category: 'general',
    }));

    expect(result.type).toBe(createThread.rejected.type);
    expect(result.payload).toBe('Unauthorized');
  });

  // Test 7: upVoteThread success
  it('upVoteThread should dispatch fulfilled with threadId and userId on success', async () => {
    api.threadsApi.upVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(upVoteThread({ threadId: 'thread-1', userId: 'user-1' }));

    expect(result.type).toBe(upVoteThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
  });

  // Test 8: upVoteThread failure
  it('upVoteThread should dispatch rejected when API call fails', async () => {
    api.threadsApi.upVote = jest.fn().mockRejectedValue(new Error('Vote failed'));

    const store = buildStore();
    const result = await store.dispatch(upVoteThread({ threadId: 'thread-1', userId: 'user-1' }));

    expect(result.type).toBe(upVoteThread.rejected.type);
    expect(result.payload).toBe('Vote failed');
  });

  // Test 9: downVoteThread success
  it('downVoteThread should dispatch fulfilled with threadId and userId on success', async () => {
    api.threadsApi.downVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(downVoteThread({ threadId: 'thread-1', userId: 'user-1' }));

    expect(result.type).toBe(downVoteThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
  });

  // Test 10: neutralVoteThread success
  it('neutralVoteThread should dispatch fulfilled with threadId and userId on success', async () => {
    api.threadsApi.neutralVote = jest.fn().mockResolvedValue({});

    const store = buildStore();
    const result = await store.dispatch(neutralVoteThread({ threadId: 'thread-1', userId: 'user-1' }));

    expect(result.type).toBe(neutralVoteThread.fulfilled.type);
    expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
  });
});
