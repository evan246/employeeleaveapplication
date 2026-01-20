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
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email })
      .pipe(catchError(this.handleError));
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