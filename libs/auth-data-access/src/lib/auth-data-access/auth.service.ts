import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
    AuthResponse,
    AuthUser,
    CreateUserRequest,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    UpdateUserRequest,
    UserListItem
} from '@tradeforge/auth-data-access';
import { UserRole } from '@tradeforge/shared-types';
import { tap } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = '/api/auth';

    private _currentUser = signal<AuthUser | null>(this.loadUser());
    readonly currentUser$ = this._currentUser.asReadonly();

    constructor(private readonly http: HttpClient, private readonly router: Router) {}

    getMe() {
        return this.http.get<AuthUser>('/api/auth/me').pipe(
            tap((user) => {
                localStorage.setItem(USER_KEY, JSON.stringify(user));
                this._currentUser.set(user);
            })
        );
    }

    getUsers() {
        return this.http.get<UserListItem[]>('/api/users');
    }

    login(payload: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap((res) => this.persist(res)),
        );
    }

    register(payload: RegisterRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
            tap((res) => this.persist(res)),
        );
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this._currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    hasRole(role: UserRole): boolean {
        return this._currentUser()?.role === role;
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    updateProfile(payload: UpdateProfileRequest) {
        return this.http.patch<AuthUser>('/api/users/me', payload).pipe(
            tap((updatedUser) => {
                const currentToken = this.getToken();
                if (currentToken) {
                    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                    this._currentUser.set(updatedUser);
                }
            }),
        );
    }

    updatePassword(payload: {
        currentPassword: string;
        newPassword: string;
    }) {
        return this.http.patch('/api/users/me/password', payload);
    }


    createUser(payload: CreateUserRequest) {
        return this.http.post<UserListItem>('/api/users', payload);
    }

    updateUser(userId: string, payload: UpdateUserRequest) {
        return this.http.patch<UserListItem>(`/api/users/${userId}`, payload);
    }

    getCurrentUser(): AuthUser | null {
        return this._currentUser();
    }

    deleteUser(userId: string) {
        return this.http.delete<{ message: string }>(`/api/users/${userId}`);
    }

    updateUserStatus(userId: string, payload: { isActive: boolean }) {
        return this.http.patch<UserListItem>(`/api/users/${userId}/status`, payload);
    }

    private persist(res: AuthResponse): void {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._currentUser.set(res.user);
    }

    private loadUser(): AuthUser | null {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    }
}
