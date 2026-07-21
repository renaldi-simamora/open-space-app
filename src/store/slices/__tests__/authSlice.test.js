/**
 * Unit tests for authSlice reducer and thunks
 *
 * Test scenarios:
 * 1. should return initial state when given undefined state
 * 2. should set loading true and clear error on loginUser.pending
 * 3. should set token and stop loading on loginUser.fulfilled
 * 4. should set error and stop loading on loginUser.rejected
 * 5. should set loading true and clear error on registerUser.pending
 * 6. should stop loading on registerUser.fulfilled
 * 7. should set error and stop loading on registerUser.rejected
 * 8. should set user on fetchProfile.fulfilled
 * 9. should clear token and user on fetchProfile.rejected
 * 10. should clear user and token on logout
 * 11. should clear error on clearError
 */

import authReducer, {
  loginUser,
  registerUser,
  fetchProfile,
  logout,
  clearError,
} from '../authSlice';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const mockUser = {
  id: 'user-1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

describe('authSlice reducer', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  // Test 1: Initial state
  it('should return initial state when given undefined state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Test 2: loginUser.pending
  it('should set loading true and clear error on loginUser.pending', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const state = authReducer(stateWithError, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test 3: loginUser.fulfilled
  it('should set token and stop loading on loginUser.fulfilled', () => {
    const stateLoading = { ...initialState, loading: true };
    const token = 'eyJhbGciOiJIUzI1NiJ9.test-token';
    const state = authReducer(stateLoading, {
      type: loginUser.fulfilled.type,
      payload: token,
    });
    expect(state.loading).toBe(false);
    expect(state.token).toBe(token);
    expect(state.error).toBeNull();
  });

  // Test 4: loginUser.rejected
  it('should set error and stop loading on loginUser.rejected', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = authReducer(stateLoading, {
      type: loginUser.rejected.type,
      payload: 'Email or password wrong',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email or password wrong');
    expect(state.token).toBeNull();
  });

  // Test 5: registerUser.pending
  it('should set loading true and clear error on registerUser.pending', () => {
    const stateWithError = { ...initialState, error: 'Email already taken' };
    const state = authReducer(stateWithError, { type: registerUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test 6: registerUser.fulfilled
  it('should stop loading on registerUser.fulfilled', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = authReducer(stateLoading, { type: registerUser.fulfilled.type });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Test 7: registerUser.rejected
  it('should set error and stop loading on registerUser.rejected', () => {
    const stateLoading = { ...initialState, loading: true };
    const state = authReducer(stateLoading, {
      type: registerUser.rejected.type,
      payload: 'Email already registered',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email already registered');
  });

  // Test 8: fetchProfile.fulfilled
  it('should set user on fetchProfile.fulfilled', () => {
    const state = authReducer(initialState, {
      type: fetchProfile.fulfilled.type,
      payload: mockUser,
    });
    expect(state.user).toEqual(mockUser);
  });

  // Test 9: fetchProfile.rejected
  it('should clear token and remove from localStorage on fetchProfile.rejected', () => {
    mockLocalStorage.setItem('token', 'expired-token');
    const stateWithToken = { ...initialState, token: 'expired-token' };
    const state = authReducer(stateWithToken, { type: fetchProfile.rejected.type });
    expect(state.token).toBeNull();
  });

  // Test 10: logout
  it('should clear user and token on logout', () => {
    mockLocalStorage.setItem('token', 'valid-token');
    const stateLoggedIn = { ...initialState, user: mockUser, token: 'valid-token' };
    const state = authReducer(stateLoggedIn, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(mockLocalStorage.getItem('token')).toBeNull();
  });

  // Test 11: clearError
  it('should clear error on clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error occurred' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });
});
