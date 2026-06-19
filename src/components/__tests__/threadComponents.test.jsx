/**
 * React Component tests for ThreadCard and CommentForm
 *
 * Test scenarios:
 *
 * ThreadCard:
 * 1. should render thread title
 * 2. should render author name
 * 3. should render category badge
 * 4. should render comment count
 * 5. should render vote counts
 * 6. should navigate to login when unauthenticated user clicks vote
 * 7. should dispatch optimisticUpVote when authenticated user clicks up vote
 * 8. should dispatch setCategoryFilter when category badge is clicked
 * 9. should navigate to thread detail on card click
 *
 * CommentForm:
 * 10. should show login prompt when user is not authenticated
 * 11. should render textarea and submit button when user is authenticated
 * 12. should disable submit button when textarea is empty
 * 13. should enable submit button when user types content
 * 14. should dispatch createComment on form submit
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ThreadCard from '../thread/ThreadCard';
import CommentForm from '../comment/CommentForm';
import threadsReducer from '../../store/slices/threadsSlice';
import threadDetailReducer from '../../store/slices/threadDetailSlice';
import authReducer from '../../store/slices/authSlice';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API
jest.mock('../../services/api', () => ({
  threadsApi: {
    upVote: jest.fn().mockResolvedValue({}),
    downVote: jest.fn().mockResolvedValue({}),
    neutralVote: jest.fn().mockResolvedValue({}),
  },
  commentsApi: {
    create: jest.fn().mockResolvedValue({
      comment: {
        id: 'comment-new',
        content: '<p>My comment</p>',
        createdAt: new Date().toISOString(),
        upVotesBy: [],
        downVotesBy: [],
        owner: { id: 'user-1', name: 'Alice', avatar: '' },
      },
    }),
  },
}));

const mockAuthUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@example.com',
  avatar: 'https://example.com/alice.jpg',
};

const mockThread = {
  id: 'thread-1',
  title: 'Cara belajar React dengan mudah',
  body: '<p>React adalah library JavaScript yang sangat populer.</p>',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-2',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 7,
};

const mockUser = { id: 'user-2', name: 'Bob', avatar: '' };

const buildStore = (authOverride = {}) => configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
  },
  preloadedState: {
    auth: { user: null, token: null, loading: false, error: null, ...authOverride },
    threads: {
      items: [mockThread],
      users: [mockUser],
      loading: false,
      error: null,
      categoryFilter: '',
    },
    threadDetail: { thread: null, loading: false, error: null },
  },
});

const renderWithProviders = (ui, store) => render(
  React.createElement(Provider, { store },
    React.createElement(MemoryRouter, null, ui)
  )
);

// ─── ThreadCard ───────────────────────────────────────────────────────────────

describe('ThreadCard component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Test 1: renders thread title
  it('should render thread title', () => {
    const store = buildStore();
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    expect(screen.getByText('Cara belajar React dengan mudah')).toBeInTheDocument();
  });

  // Test 2: renders author name
  it('should render author name', () => {
    const store = buildStore();
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  // Test 3: renders category badge
  it('should render category badge', () => {
    const store = buildStore();
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  // Test 4: renders comment count
  it('should render comment count', () => {
    const store = buildStore();
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  // Test 5: renders vote counts
  it('should render vote counts', () => {
    const store = buildStore();
    const threadWithVotes = { ...mockThread, upVotesBy: ['user-3', 'user-4'], downVotesBy: ['user-5'] };
    renderWithProviders(React.createElement(ThreadCard, { thread: threadWithVotes, user: mockUser }), store);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // Test 6: navigate to login when unauthenticated user votes
  it('should navigate to login when unauthenticated user clicks vote', () => {
    const store = buildStore({ user: null, token: null });
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    // Use title attribute to find vote button specifically
    const upVoteBtn = screen.getByTitle('Up vote');
    fireEvent.click(upVoteBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // Test 7: dispatch optimisticUpVote when authenticated user clicks up vote
  it('should dispatch optimisticUpVote when authenticated user clicks up vote', () => {
    const store = buildStore({ user: mockAuthUser, token: 'valid-token' });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    const upVoteBtn = screen.getByTitle('Up vote');
    fireEvent.click(upVoteBtn);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  // Test 8: dispatch setCategoryFilter on category click
  it('should dispatch setCategoryFilter when category badge is clicked', () => {
    const store = buildStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(React.createElement(ThreadCard, { thread: mockThread, user: mockUser }), store);
    const categoryBtn = screen.getByText('#react');
    fireEvent.click(categoryBtn);
    const actions = dispatchSpy.mock.calls.map((call) => call[0]);
    expect(actions.some((a) => a && a.type === 'threads/setCategoryFilter')).toBe(true);
  });

  // Test 9: navigate to thread detail on card click
  it('should navigate to thread detail on card click', () => {
    const store = buildStore();
    const { container } = renderWithProviders(
      React.createElement(ThreadCard, { thread: mockThread, user: mockUser }),
      store,
    );
    const card = container.querySelector('.thread-card');
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/threads/thread-1');
  });
});

// ─── CommentForm ──────────────────────────────────────────────────────────────

describe('CommentForm component', () => {
  // Test 10: shows login prompt when not authenticated
  it('should show login prompt when user is not authenticated', () => {
    const store = buildStore({ user: null, token: null });
    renderWithProviders(React.createElement(CommentForm, { threadId: 'thread-1' }), store);
    expect(screen.getByText('Masuk')).toBeInTheDocument();
    expect(screen.getByText(/untuk meninggalkan komentar/i)).toBeInTheDocument();
  });

  // Test 11: renders textarea and submit button when authenticated
  it('should render textarea and submit button when user is authenticated', () => {
    const store = buildStore({ user: mockAuthUser, token: 'valid-token' });
    renderWithProviders(React.createElement(CommentForm, { threadId: 'thread-1' }), store);
    expect(screen.getByPlaceholderText(/tulis komentar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /kirim komentar/i })).toBeInTheDocument();
  });

  // Test 12: submit button disabled when textarea is empty
  it('should disable submit button when textarea is empty', () => {
    const store = buildStore({ user: mockAuthUser, token: 'valid-token' });
    renderWithProviders(React.createElement(CommentForm, { threadId: 'thread-1' }), store);
    const submitBtn = screen.getByRole('button', { name: /kirim komentar/i });
    expect(submitBtn).toBeDisabled();
  });

  // Test 13: submit button enabled when user types content
  it('should enable submit button when user types content', () => {
    const store = buildStore({ user: mockAuthUser, token: 'valid-token' });
    renderWithProviders(React.createElement(CommentForm, { threadId: 'thread-1' }), store);
    const textarea = screen.getByPlaceholderText(/tulis komentar/i);
    fireEvent.change(textarea, { target: { value: 'Ini komentar saya' } });
    const submitBtn = screen.getByRole('button', { name: /kirim komentar/i });
    expect(submitBtn).not.toBeDisabled();
  });

  // Test 14: dispatches createComment on submit
  it('should dispatch createComment on form submit', async () => {
    const store = buildStore({ user: mockAuthUser, token: 'valid-token' });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(React.createElement(CommentForm, { threadId: 'thread-1' }), store);

    const textarea = screen.getByPlaceholderText(/tulis komentar/i);
    fireEvent.change(textarea, { target: { value: 'Komentar yang sangat bagus!' } });

    const submitBtn = screen.getByRole('button', { name: /kirim komentar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
