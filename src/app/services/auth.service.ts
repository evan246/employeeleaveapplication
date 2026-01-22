import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    token: string;
    user: User;
    expiresIn: number;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://freeapi.miniprojectideas.com/api/EmployeeLeave';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize user from storage only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeStorage();
      this.currentUserSubject.next(this.getUserFromStorage());
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService.login called with:', credentials);

    // Demo mode: Check for demo credentials
    const isDemo = this.isDemoCredentials(credentials);
    console.log('Is demo credentials:', isDemo);

    if (isDemo) {
      console.log('Using demo login');
      const demoResponse: LoginResponse = {
        message: 'Login successful',
        result: true,
        data: this.getDemoUserData(credentials.email)
      };
      return of(demoResponse).pipe(
        tap(response => {
          console.log('Setting demo session:', response.data);
          if (response.result && response.data) {
            this.setSession(response.data);
          }
        }),
        delay(1000) // Simulate API delay
      );
    }

    // Real API call
    console.log('Making API call to:', `${this.API_URL}/Login`);
    return this.http.post<LoginResponse>(`${this.API_URL}/Login`, credentials)
      .pipe(
        tap(response => {
          console.log('API response received:', response);
          if (response.result && response.data) {
            this.setSession(response.data);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('API call failed:', error);
          // Handle different error response formats
          if (error.error && typeof error.error === 'object') {
            const apiError = error.error;
            if (apiError.message) {
              return throwError(() => new Error(apiError.message));
            }
            if (apiError.error) {
              return throwError(() => new Error(apiError.error));
            }
          }
          return this.handleError(error);
        })
      );
  }

  private isDemoCredentials(credentials: LoginRequest): boolean {
    const demoCredentials = [
      { email: 'admin@company.com', password: 'admin123' },
      { email: 'employee@company.com', password: 'emp123' },
      { email: 'manager@company.com', password: 'mgr123' },
      { email: 'hr@company.com', password: 'demo123' }
    ];
    return demoCredentials.some(cred =>
      cred.email === credentials.email && cred.password === credentials.password
    );
  }

  private getDemoUserData(email: string): { token: string; user: User; expiresIn: number } {
    const userMap: { [key: string]: User } = {
      'admin@company.com': {
        id: '1',
        email: 'admin@company.com',
        name: 'Admin User',
        role: 'admin'
      },
      'manager@company.com': {
        id: '2',
        email: 'manager@company.com',
        name: 'Manager User',
        role: 'manager'
      },
      'employee@company.com': {
        id: '3',
        email: 'employee@company.com',
        name: 'Employee User',
        role: 'employee'
      },
      'hr@company.com': {
        id: '4',
        email: 'hr@company.com',
        name: 'HR User',
        role: 'hr'
      }
    };

    const user = userMap[email];
    return {
      token: `demo-token-${user.id}-${Date.now()}`,
      user: user,
      expiresIn: 3600
    };
  }

  forgotPassword(email: string): Observable<any> {
    // For demo purposes - replace with actual API call
    return new Observable(observer => {
      setTimeout(() => {
        const demoEmails = ['admin@company.com', 'employee@company.com', 'manager@company.com', 'hr@company.com'];
        if (demoEmails.includes(email)) {
          observer.next({ message: 'Password reset email sent successfully' });
        } else {
          observer.error(new Error('Email not found'));
        }
        observer.complete();
      }, 1000);
    });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, password })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      // Also clear any potential corrupted data
      this.clearCorruptedStorage();
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // During SSR, assume not logged in
    }
    const token = this.getToken();
    if (!token) return false;

    // Check if it's a demo token
    if (token.startsWith('demo-token-')) {
      // For demo tokens, check if user data exists
      const user = this.getCurrentUser();
      return user !== null;
    }

    const payload = this.decodeToken(token);
    const expiry = payload?.exp;
    return expiry ? expiry > Date.now() / 1000 : false;
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // During SSR, no localStorage access
    }
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setSession(data: { token: string; user: User; expiresIn: number }): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
    }
    this.currentUserSubject.next(data.user);
  }

  private initializeStorage(): void {
    this.clearCorruptedStorage();
  }

  private clearCorruptedStorage(): void {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);

      // Remove corrupted token data
      if (token === 'undefined' || token === 'null' || token === '') {
        localStorage.removeItem(this.tokenKey);
      }

      // Remove corrupted user data
      if (userStr === 'undefined' || userStr === 'null' || userStr === '') {
        localStorage.removeItem(this.userKey);
      }
    } catch (error) {
      // If localStorage access fails, clear everything
      try {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      } catch {
        // Ignore errors during cleanup
      }
    }
  }

  private getUserFromStorage(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      // If parsing fails, clear the invalid data
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}