import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
  token: string;
  user: User;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth'; // Base URL from Swagger
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // For demo purposes - replace with actual API call
    return new Observable(observer => {
      setTimeout(() => {
        // Demo credentials
        const demoUsers = [
          { email: 'admin@company.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
          { email: 'employee@company.com', password: 'emp123', role: 'employee' as const, name: 'John Employee' },
          { email: 'manager@company.com', password: 'mgr123', role: 'manager' as const, name: 'Jane Manager' }
        ];

        const user = demoUsers.find(u => u.email === credentials.email && u.password === credentials.password);

        if (user) {
          const response: LoginResponse = {
            token: `demo-token-${Date.now()}`,
            user: {
              id: `user-${user.role}`,
              email: user.email,
              name: user.name,
              role: user.role
            },
            expiresIn: 3600 // 1 hour
          };
          this.setSession(response);
          observer.next(response);
        } else {
          observer.error(new Error('Invalid email or password'));
        }
        observer.complete();
      }, 1000); // Simulate API delay
    });
  }

  forgotPassword(email: string): Observable<any> {
    // For demo purposes - replace with actual API call
    return new Observable(observer => {
      setTimeout(() => {
        const demoEmails = ['admin@company.com', 'employee@company.com', 'manager@company.com'];
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
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    const expiry = payload?.exp;
    return expiry ? expiry > Date.now() / 1000 : false;
  }

  getToken(): string | null {
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

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
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