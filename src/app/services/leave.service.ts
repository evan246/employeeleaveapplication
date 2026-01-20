import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Leave, LeaveRequest, LeaveBalance, ApprovalAction } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly API_URL = '/api/leaves';

  // Demo data
  private demoLeaves: Leave[] = [
    {
      id: '1',
      employeeId: 'user-employee',
      leaveType: 'annual',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-01-10',
      approvedDate: '2024-01-12',
      approvedBy: 'Jane Manager',
      comments: 'Enjoy your vacation!'
    },
    {
      id: '2',
      employeeId: 'user-employee',
      leaveType: 'sick',
      startDate: '2024-02-05',
      endDate: '2024-02-07',
      days: 3,
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: '2024-02-01'
    }
  ];

  constructor(private http: HttpClient) {}

  getMyLeaves(): Observable<Leave[]> {
    // Demo implementation - replace with actual API call
    return of(this.demoLeaves.filter(leave => leave.employeeId === 'user-employee')).pipe(delay(500));
  }

  getLeaveById(id: string): Observable<Leave> {
    return this.http.get<Leave>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  applyForLeave(request: LeaveRequest): Observable<Leave> {
    // Demo implementation - replace with actual API call
    const newLeave: Leave = {
      id: Date.now().toString(),
      employeeId: 'user-employee',
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      days: Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      reason: request.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    this.demoLeaves.push(newLeave);
    return of(newLeave).pipe(delay(1000));
  }

  getLeaveBalance(): Observable<LeaveBalance> {
    // Demo implementation - replace with actual API call
    const balance: LeaveBalance = {
      annual: 25,
      sick: 10,
      casual: 5,
      maternity: 90,
      unpaid: 0
    };
    return of(balance).pipe(delay(300));
  }

  // Manager/HR functions
  getPendingApprovals(): Observable<Leave[]> {
    // Demo implementation - return pending leaves
    return of(this.demoLeaves.filter(leave => leave.status === 'pending')).pipe(delay(500));
  }

  approveLeave(action: ApprovalAction): Observable<Leave> {
    // Demo implementation - update leave status
    const leave = this.demoLeaves.find(l => l.id === action.leaveId);
    if (leave) {
      leave.status = action.action === 'approve' ? 'approved' : 'rejected';
      leave.approvedDate = new Date().toISOString().split('T')[0];
      leave.approvedBy = 'Demo Manager';
      if (action.comments) {
        leave.comments = action.comments;
      }
      return of(leave).pipe(delay(800));
    }
    return throwError(() => new Error('Leave request not found'));
  }

  getTeamLeaves(): Observable<Leave[]> {
    // Demo implementation - return all leaves for demo
    return of(this.demoLeaves).pipe(delay(500));
  }

  // HR/Admin functions
  getAllLeaves(filters?: any): Observable<Leave[]> {
    // Demo implementation - return all leaves
    return of(this.demoLeaves).pipe(delay(500));
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