// ***********************************************
// Custom Cypress Commands
// ***********************************************

// Custom command: login via UI with mocked API
Cypress.Commands.add('loginWithMock', (email = 'testuser@forum.dev', password = 'testpassword123') => {
  const BASE_API = 'https://forum-api.dicoding.dev/v1';
  const fakeToken = 'fake-jwt-token-for-testing';
  const fakeUser = {
    id: 'user-test-123',
    name: 'Test User',
    email,
    avatar: 'https://ui-avatars.com/api/?name=Test+User',
  };

  cy.intercept('POST', `${BASE_API}/login`, {
    statusCode: 200,
    body: { status: 'success', data: { token: fakeToken } },
  });

  cy.intercept('GET', `${BASE_API}/users/me`, {
    statusCode: 200,
    body: { status: 'success', data: { user: fakeUser } },
  });

  cy.intercept('GET', `${BASE_API}/threads`, {
    statusCode: 200,
    body: { status: 'success', data: { threads: [] } },
  });

  cy.intercept('GET', `${BASE_API}/users`, {
    statusCode: 200,
    body: { status: 'success', data: { users: [fakeUser] } },
  });

  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);
});
