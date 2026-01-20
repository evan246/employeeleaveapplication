import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Leave, LeaveRequest, LeaveBalance, ApprovalAction } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly API_URL = '/api/leaves';

  constructor(private http: HttpClient) {}

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.API_URL}/my`)
      .pipe(catchError(this.handleError));
  }

  getLeaveById(id: string): Observable<Leave> {
    return this.http.get<Leave>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  applyForLeave(request: LeaveRequest): Observable<Leave> {
    const formData = new FormData();
    formData.append('leaveType', request.leaveType);
    formData.append('startDate', request.startDate);
    formData.append('endDate', request.endDate);
    formData.append('reason', request.reason);
    if (request.attachment) {
      formData.append('attachment', request.attachment);
    }

    return this.http.post<Leave>(`${this.API_URL}/apply`, formData)
      .pipe(catchError(this.handleError));
  }

  getLeaveBalance(): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${this.API_URL}/balance`)
      .pipe(catchError(this.handleError));
  }

  // Manager/HR functions
  getPendingApprovals(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.API_URL}/pending-approvals`)
      .pipe(catchError(this.handleError));
  }

  approveLeave(action: ApprovalAction): Observable<Leave> {
    return this.http.post<Leave>(`${this.API_URL}/approve`, action)
      .pipe(catchError(this.handleError));
  }

  getTeamLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.API_URL}/team`)
      .pipe(catchError(this.handleError));
  }

  // HR/Admin functions
  getAllLeaves(filters?: any): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.API_URL}/all`, { params: filters })
      .pipe(catchError(this.handleError));
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