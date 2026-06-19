const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
};

export const authApi = {
  register: (name, email, password) => fetchWithAuth(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  login: (email, password) => fetchWithAuth(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getProfile: () => fetchWithAuth(`${BASE_URL}/users/me`),
};

export const usersApi = {
  getAll: () => fetchWithAuth(`${BASE_URL}/users`),
};

export const threadsApi = {
  getAll: () => fetchWithAuth(`${BASE_URL}/threads`),
  getDetail: (threadId) => fetchWithAuth(`${BASE_URL}/threads/${threadId}`),
  create: (title, body, category) => fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  }),
  upVote: (threadId) => fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, { method: 'POST' }),
  downVote: (threadId) => fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, { method: 'POST' }),
  neutralVote: (threadId) => fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, { method: 'POST' }),
};

export const commentsApi = {
  create: (threadId, content) => fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  upVote: (threadId, commentId) => fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: 'POST' },
  ),
  downVote: (threadId, commentId) => fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: 'POST' },
  ),
  neutralVote: (threadId, commentId) => fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: 'POST' },
  ),
};

export const leaderboardApi = {
  get: () => fetchWithAuth(`${BASE_URL}/leaderboards`),
};
