/**
 * Unit tests for threadsSlice reducer
 *
 * Test scenarios:
 * 1. should return initial state when given undefined state
 * 2. should set categoryFilter when setCategoryFilter is dispatched
 * 3. should clear categoryFilter when setCategoryFilter is dispatched with empty string
 * 4. should apply optimistic up vote when user has not voted yet
 * 5. should remove up vote (neutral) when user already up voted
 * 6. should apply optimistic down vote when user has not voted yet
 * 7. should remove down vote (neutral) when user already down voted
 * 8. should set loading true and clear error on fetchThreads.pending
 * 9. should set items and stop loading on fetchThreads.fulfilled
 * 10. should set error and stop loading on fetchThreads.rejected
 * 11. should prepend new thread on createThread.fulfilled
 * 12. should set users on fetchUsers.fulfilled
 */

import threadsReducer, {
  setCategoryFilter,
  optimisticUpVote,
  optimisticDownVote,
  fetchThreads,
  fetchUsers,
  createThread,
} from '../threadsSlice';

const initialState = {
  items: [],
  users: [],
  loading: false,
  error: null,
  categoryFilter: '',
};

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: '<p>Test body</p>',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const mockThreadUpVoted = {
  ...mockThread,
  id: 'thread-2',
  upVotesBy: ['user-1'],
};

const mockThreadDownVoted = {
  ...mockThread,
  id: 'thread-3',
  downVotesBy: ['user-1'],
};

describe('threadsSlice reducer', () => {
  // Test 1: Initial state
  it('should return initial state when given undefined state', () => {
    const state = threadsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  // Test 2: setCategoryFilter
  it('should set categoryFilter when setCategoryFilter is dispatched', () => {
    const state = threadsReducer(initialState, setCategoryFilter('react'));
    expect(state.categoryFilter).toBe('react');
  });

  // Test 3: setCategoryFilter with empty string
  it('should clear categoryFilter when setCategoryFilter is dispatched with empty string', () => {
    const stateWithFilter = { ...initialState, categoryFilter: 'react' };
    const state = threadsReducer(stateWithFilter, setCategoryFilter(''));
    expect(state.categoryFilter).toBe('');
  });

  // Test 4: optimisticUpVote - not voted yet
  it('should apply optimistic up vote when user has not voted yet', () => {
    const stateWithThread = { ...initialState, items: [{ ...mockThread }] };
    const state = threadsReducer(
      stateWithThread,
      optimisticUpVote({ threadId: 'thread-1', userId: 'user-1' }),
    );
    expect(state.items[0].upVotesBy).toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  // Test 5: optimisticUpVote - toggle off (already up voted)
  it('should remove up vote (neutral) when user already up voted', () => {
    const stateWithUpVotedThread = { ...initialState, items: [{ ...mockThreadUpVoted }] };
    const state = threadsReducer(
      stateWithUpVotedThread,
      optimisticUpVote({ threadId: 'thread-2', userId: 'user-1' }),
    );
    expect(state.items[0].upVotesBy).not.toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  // Test 6: optimisticDownVote - not voted yet
  it('should apply optimistic down vote when user has not voted yet', () => {
    const stateWithThread = { ...initialState, items: [{ ...mockThread }] };
    const state = threadsReducer(
      stateWithThread,
      optimisticDownVote({ threadId: 'thread-1', userId: 'user-1' }),
    );
    expect(state.items[0].downVotesBy).toContain('user-1');
    expect(state.items[0].upVotesBy).not.toContain('user-1');
  });

  // Test 7: optimisticDownVote - toggle off (already down voted)
  it('should remove down vote (neutral) when user already down voted', () => {
    const stateWithDownVotedThread = { ...initialState, items: [{ ...mockThreadDownVoted }] };
    const state = threadsReducer(
      stateWithDownVotedThread,
      optimisticDownVote({ threadId: 'thread-3', userId: 'user-1' }),
    );
    expect(state.items[0].downVotesBy).not.toContain('user-1');
    expect(state.items[0].upVotesBy).not.toContain('user-1');
  });

  // Test 8: fetchThreads.pending
  it('should set loading true and clear error on fetchThreads.pending', () => {
    const stateWithError = { ...initialState, error: 'Some error', loading: false };
    const state = threadsReducer(stateWithError, { type: fetchThreads.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test 9: fetchThreads.fulfilled
  it('should set items and stop loading on fetchThreads.fulfilled', () => {
    const stateLoading = { ...initialState, loading: true };
    const threads = [mockThread, mockThreadUpVoted];
    const state = threadsReducer(stateLoading, {
      type: fetchThreads.fulfilled.type,
      payload: threads,
    });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(threads);
  });

  // Test 10: fetchThreads.rejected
  it('should set error and stop loading on fetchThreads.rejected', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = threadsReducer(stateLoading, {
      type: fetchThreads.rejected.type,
      payload: 'Network error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  // Test 11: createThread.fulfilled
  it('should prepend new thread to items on createThread.fulfilled', () => {
    const existingState = { ...initialState, items: [mockThread] };
    const newThread = { ...mockThread, id: 'thread-new', title: 'New Thread' };
    const state = threadsReducer(existingState, {
      type: createThread.fulfilled.type,
      payload: newThread,
    });
    expect(state.items[0]).toEqual(newThread);
    expect(state.items).toHaveLength(2);
  });

  // Test 12: fetchUsers.fulfilled
  it('should set users on fetchUsers.fulfilled', () => {
    const users = [{ id: 'user-1', name: 'Alice' }, { id: 'user-2', name: 'Bob' }];
    const state = threadsReducer(initialState, {
      type: fetchUsers.fulfilled.type,
      payload: users,
    });
    expect(state.users).toEqual(users);
  });
});
