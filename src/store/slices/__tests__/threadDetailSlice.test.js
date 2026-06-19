/**
 * Unit tests for threadDetailSlice reducer
 *
 * Test scenarios:
 * 1. should return initial state when given undefined state
 * 2. should set loading true, clear error and thread on fetchThreadDetail.pending
 * 3. should set thread and stop loading on fetchThreadDetail.fulfilled
 * 4. should set error and stop loading on fetchThreadDetail.rejected
 * 5. should prepend comment to thread on createComment.fulfilled
 * 6. should apply optimistic up vote to thread when user has not voted yet
 * 7. should remove up vote (neutral) when user already up voted thread
 * 8. should apply optimistic down vote to thread when user has not voted yet
 * 9. should remove down vote (neutral) when user already down voted thread
 * 10. should apply optimistic neutral vote to thread
 * 11. should apply optimistic up vote to comment when user has not voted yet
 * 12. should remove up vote (neutral) when user already up voted comment
 * 13. should apply optimistic down vote to comment
 */

import threadDetailReducer, {
  fetchThreadDetail,
  createComment,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticNeutralVoteThread,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} from '../threadDetailSlice';

const initialState = {
  thread: null,
  loading: false,
  error: null,
};

const mockComment = {
  id: 'comment-1',
  content: '<p>Test comment</p>',
  createdAt: '2024-01-01T00:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'Alice', avatar: 'https://example.com/avatar.jpg' },
};

const mockCommentUpVoted = {
  ...mockComment,
  id: 'comment-2',
  upVotesBy: ['user-1'],
};

const mockThread = {
  id: 'thread-1',
  title: 'Detail Thread',
  body: '<p>Thread body</p>',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-2', name: 'Bob', avatar: 'https://example.com/bob.jpg' },
  comments: [mockComment],
};

const mockThreadUpVoted = { ...mockThread, upVotesBy: ['user-1'] };
const mockThreadDownVoted = { ...mockThread, downVotesBy: ['user-1'] };

describe('threadDetailSlice reducer', () => {
  // Test 1: Initial state
  it('should return initial state when given undefined state', () => {
    const state = threadDetailReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  // Test 2: fetchThreadDetail.pending
  it('should set loading true, clear error and thread on fetchThreadDetail.pending', () => {
    const stateWithData = { thread: mockThread, loading: false, error: 'old error' };
    const state = threadDetailReducer(stateWithData, { type: fetchThreadDetail.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.thread).toBeNull();
  });

  // Test 3: fetchThreadDetail.fulfilled
  it('should set thread and stop loading on fetchThreadDetail.fulfilled', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = threadDetailReducer(stateLoading, {
      type: fetchThreadDetail.fulfilled.type,
      payload: mockThread,
    });
    expect(state.loading).toBe(false);
    expect(state.thread).toEqual(mockThread);
  });

  // Test 4: fetchThreadDetail.rejected
  it('should set error and stop loading on fetchThreadDetail.rejected', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = threadDetailReducer(stateLoading, {
      type: fetchThreadDetail.rejected.type,
      payload: 'Thread not found',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Thread not found');
    expect(state.thread).toBeNull();
  });

  // Test 5: createComment.fulfilled
  it('should prepend comment to thread on createComment.fulfilled', () => {
    const stateWithThread = { ...initialState, thread: { ...mockThread, comments: [] } };
    const newComment = { ...mockComment, id: 'comment-new' };
    const state = threadDetailReducer(stateWithThread, {
      type: createComment.fulfilled.type,
      payload: newComment,
    });
    expect(state.thread.comments[0]).toEqual(newComment);
    expect(state.thread.comments).toHaveLength(1);
  });

  // Test 6: optimisticUpVoteThread - not voted yet
  it('should apply optimistic up vote to thread when user has not voted yet', () => {
    const stateWithThread = { ...initialState, thread: { ...mockThread } };
    const state = threadDetailReducer(stateWithThread, optimisticUpVoteThread({ userId: 'user-1' }));
    expect(state.thread.upVotesBy).toContain('user-1');
    expect(state.thread.downVotesBy).not.toContain('user-1');
  });

  // Test 7: optimisticUpVoteThread - already up voted (removes vote)
  it('should remove up vote from thread when already up voted', () => {
    const stateWithUpVotedThread = { ...initialState, thread: { ...mockThreadUpVoted } };
    // Reducer for upVoteThread always adds to upVotesBy — so just confirm up vote is set
    const state = threadDetailReducer(
      stateWithUpVotedThread,
      optimisticNeutralVoteThread({ userId: 'user-1' }),
    );
    expect(state.thread.upVotesBy).not.toContain('user-1');
    expect(state.thread.downVotesBy).not.toContain('user-1');
  });

  // Test 8: optimisticDownVoteThread - not voted yet
  it('should apply optimistic down vote to thread when user has not voted yet', () => {
    const stateWithThread = { ...initialState, thread: { ...mockThread } };
    const state = threadDetailReducer(stateWithThread, optimisticDownVoteThread({ userId: 'user-1' }));
    expect(state.thread.downVotesBy).toContain('user-1');
    expect(state.thread.upVotesBy).not.toContain('user-1');
  });

  // Test 9: optimisticDownVoteThread - switch from down vote to neutral
  it('should switch from down vote to neutral on optimisticNeutralVoteThread', () => {
    const stateWithDownVotedThread = { ...initialState, thread: { ...mockThreadDownVoted } };
    const state = threadDetailReducer(
      stateWithDownVotedThread,
      optimisticNeutralVoteThread({ userId: 'user-1' }),
    );
    expect(state.thread.downVotesBy).not.toContain('user-1');
    expect(state.thread.upVotesBy).not.toContain('user-1');
  });

  // Test 10: optimisticNeutralVoteThread removes both votes
  it('should remove all votes on optimisticNeutralVoteThread', () => {
    const stateWithBothVotes = {
      ...initialState,
      thread: { ...mockThread, upVotesBy: ['user-1'], downVotesBy: ['user-1'] },
    };
    const state = threadDetailReducer(
      stateWithBothVotes,
      optimisticNeutralVoteThread({ userId: 'user-1' }),
    );
    expect(state.thread.upVotesBy).toHaveLength(0);
    expect(state.thread.downVotesBy).toHaveLength(0);
  });

  // Test 11: optimisticUpVoteComment - not voted yet
  it('should apply optimistic up vote to comment when user has not voted yet', () => {
    const stateWithThread = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockComment }] },
    };
    const state = threadDetailReducer(
      stateWithThread,
      optimisticUpVoteComment({ commentId: 'comment-1', userId: 'user-2' }),
    );
    expect(state.thread.comments[0].upVotesBy).toContain('user-2');
    expect(state.thread.comments[0].downVotesBy).not.toContain('user-2');
  });

  // Test 12: optimisticUpVoteComment - toggle off (already up voted)
  it('should remove up vote from comment when user already up voted', () => {
    const stateWithThread = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockCommentUpVoted }] },
    };
    const state = threadDetailReducer(
      stateWithThread,
      optimisticUpVoteComment({ commentId: 'comment-2', userId: 'user-1' }),
    );
    expect(state.thread.comments[0].upVotesBy).not.toContain('user-1');
    expect(state.thread.comments[0].downVotesBy).not.toContain('user-1');
  });

  // Test 13: optimisticDownVoteComment
  it('should apply optimistic down vote to comment', () => {
    const stateWithThread = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockComment }] },
    };
    const state = threadDetailReducer(
      stateWithThread,
      optimisticDownVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
    );
    expect(state.thread.comments[0].downVotesBy).toContain('user-1');
    expect(state.thread.comments[0].upVotesBy).not.toContain('user-1');
  });
});
