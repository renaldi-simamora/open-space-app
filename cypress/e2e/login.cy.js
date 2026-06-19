/**
 * End-to-End tests for Login Flow
 *
 * Test scenarios:
 * 1. should display login form correctly
 * 2. should show error when login with invalid credentials
 * 3. should require email and password fields (HTML5 validation)
 * 4. should successfully login with valid credentials and redirect to home
 * 5. should show logged-in user name in navbar after login
 * 6. should be able to logout after login
 * 7. should navigate to register page from login page
 */

const BASE_API = 'https://forum-api.dicoding.dev/v1';

const fakeToken = 'fake-jwt-token-for-testing';

const fakeUser = {
  id: 'user-test-123',
  name: 'Test User',
  email: 'testuser@forum.dev',
  avatar: 'https://ui-avatars.com/api/?name=Test+User',
};

const fakeThreads = [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Isi thread pertama yang sangat menarik',
    category: 'General',
    createdAt: new Date().toISOString(),
    ownerId: 'user-test-123',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  },
];

const fakeUsers = [
  { id: 'user-test-123', name: 'Test User', email: 'testuser@forum.dev', avatar: '' },
];

describe('Login Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  // Test 1: Tampilkan form login dengan benar
  it('should display login form correctly', () => {
    cy.get('h1').should('contain', 'Selamat Datang');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Masuk');
  });

  // Test 2: Tampilkan error saat kredensial salah
  it('should show error when login with invalid credentials', () => {
    // Mock API login response gagal (401)
    cy.intercept('POST', `${BASE_API}/login`, {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginFail');

    cy.get('input[type="email"]').type('wrong@email.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    // Harus tampil pesan error
    cy.get('.alert--error', { timeout: 8000 }).should('be.visible');
  });

  // Test 3: Field email dan password harus wajib diisi
  it('should require email and password fields', () => {
    cy.get('input[type="email"]').should('have.attr', 'required');
    cy.get('input[type="password"]').should('have.attr', 'required');
  });

  // Test 4: Login berhasil dan redirect ke home
  it('should successfully login with valid credentials and redirect to home', () => {
    // Mock login sukses
    cy.intercept('POST', `${BASE_API}/login`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: { token: fakeToken },
      },
    }).as('loginSuccess');

    // Mock get profile
    cy.intercept('GET', `${BASE_API}/users/me`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: { user: fakeUser },
      },
    }).as('getProfile');

    // Mock get threads (untuk halaman home)
    cy.intercept('GET', `${BASE_API}/threads`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: { threads: fakeThreads },
      },
    }).as('getThreads');

    // Mock get users
    cy.intercept('GET', `${BASE_API}/users`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: { users: fakeUsers },
      },
    }).as('getUsers');

    cy.get('input[type="email"]').type('testuser@forum.dev');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    // Harus redirect ke home
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);
  });

  // Test 5: Tampilkan nama user di navbar setelah login
  it('should show logged-in user name in navbar after login', () => {
    cy.intercept('POST', `${BASE_API}/login`, {
      statusCode: 200,
      body: { status: 'success', data: { token: fakeToken } },
    }).as('loginSuccess');

    cy.intercept('GET', `${BASE_API}/users/me`, {
      statusCode: 200,
      body: { status: 'success', data: { user: fakeUser } },
    }).as('getProfile');

    cy.intercept('GET', `${BASE_API}/threads`, {
      statusCode: 200,
      body: { status: 'success', data: { threads: fakeThreads } },
    }).as('getThreads');

    cy.intercept('GET', `${BASE_API}/users`, {
      statusCode: 200,
      body: { status: 'success', data: { users: fakeUsers } },
    }).as('getUsers');

    cy.get('input[type="email"]').type('testuser@forum.dev');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);

    // Navbar harus tampilkan nama user
    cy.get('.navbar__username', { timeout: 8000 })
      .should('be.visible')
      .and('contain', fakeUser.name);
  });

  // Test 6: Logout setelah login
  it('should be able to logout after login', () => {
    cy.intercept('POST', `${BASE_API}/login`, {
      statusCode: 200,
      body: { status: 'success', data: { token: fakeToken } },
    }).as('loginSuccess');

    cy.intercept('GET', `${BASE_API}/users/me`, {
      statusCode: 200,
      body: { status: 'success', data: { user: fakeUser } },
    }).as('getProfile');

    cy.intercept('GET', `${BASE_API}/threads`, {
      statusCode: 200,
      body: { status: 'success', data: { threads: fakeThreads } },
    }).as('getThreads');

    cy.intercept('GET', `${BASE_API}/users`, {
      statusCode: 200,
      body: { status: 'success', data: { users: fakeUsers } },
    }).as('getUsers');

    cy.get('input[type="email"]').type('testuser@forum.dev');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);

    // Klik tombol keluar
    cy.contains('button', 'Keluar', { timeout: 8000 }).click();

    // Setelah logout, navbar auth (tombol masuk/daftar) harus muncul
    cy.get('.navbar__auth', { timeout: 5000 }).should('be.visible');
  });

  // Test 7: Navigasi ke halaman register dari halaman login
  it('should navigate to register page from login page', () => {
    cy.contains('a', 'Daftar sekarang').click();
    cy.url().should('include', '/register');
    cy.get('h1', { timeout: 5000 }).should('contain', 'Buat Akun');
  });
});
