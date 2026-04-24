import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthResponse, AuthUser } from '@tradeforge/auth-data-access';
import { UserRole } from '@tradeforge/shared-types';
import { AuthService } from './auth.service';

const mockUser: AuthUser = {
  id: 'user-1',
  email: 'demo@tradeforge.local',
  name: 'Demo Viewer',
  role: UserRole.VIEWER,
};

const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-jwt-token',
  user: mockUser,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let routerSpy: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(() => {
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  // ─── isAuthenticated ────────────────────────────────────────────────────────

  describe('isAuthenticated()', () => {
    it('returns false when no token is stored', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('returns true when a token is stored', () => {
      localStorage.setItem('auth_token', 'some-token');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  // ─── hasRole ────────────────────────────────────────────────────────────────

  describe('hasRole()', () => {
    it('returns false when no user is logged in', () => {
      expect(service.hasRole(UserRole.VIEWER)).toBe(false);
    });

    it('returns true when current user has the given role', () => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      // re-create service so signal loads from localStorage
      service = new AuthService(TestBed.inject(require('@angular/common/http').HttpClient), routerSpy as unknown as Router);
      expect(service.hasRole(UserRole.VIEWER)).toBe(true);
    });
  });

  // ─── getToken ───────────────────────────────────────────────────────────────

  describe('getToken()', () => {
    it('returns null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem('auth_token', 'abc123');
      expect(service.getToken()).toBe('abc123');
    });
  });

  // ─── login ──────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('POSTs to /api/auth/login and persists token + user', () => {
      service.login({ email: 'demo@tradeforge.local', password: 'Viewer123!' }).subscribe();

      const req = httpTesting.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'demo@tradeforge.local', password: 'Viewer123!' });

      req.flush(mockAuthResponse);

      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  // ─── register ───────────────────────────────────────────────────────────────

  describe('register()', () => {
    it('POSTs to /api/auth/register and persists token + user', () => {
      service.register({ email: 'new@tradeforge.local', password: 'Pass123!', name: 'New User' }).subscribe();

      const req = httpTesting.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');

      req.flush(mockAuthResponse);

      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      expect(service.getCurrentUser()).toEqual(mockUser);
    });
  });

  // ─── logout ─────────────────────────────────────────────────────────────────

  describe('logout()', () => {
    it('clears localStorage, resets currentUser, and redirects to /auth/login', () => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
