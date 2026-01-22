import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Leave, LeaveRequest, LeaveBalance, ApprovalAction, LeaveType, LeaveStatus } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly API_URL = 'https://freeapi.miniprojectideas.com/api/EmployeeLeave';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getMyLeaves(): Observable<Leave[]> {
    // Check if running in browser (localStorage not available during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return of([]); // Return empty array during SSR
    }

    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return demo data
        return of(this.getDemoLeaves(user)).pipe(delay(500));
      }
    }

    // Real API call
    if (!userData) {
      return throwError(() => new Error('User not authenticated'));
    }

    const user = JSON.parse(userData);
    return this.http.get<Leave[]>(`${this.API_URL}/GetAllLeavesByEmployeeId?employeeId=${user.id}`)
      .pipe(catchError(this.handleError));
  }

  getLeaveById(id: string): Observable<Leave> {
    return this.http.get<Leave>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  applyForLeave(request: LeaveRequest): Observable<Leave> {
    // Check if running in browser (localStorage not available during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Cannot apply for leave during server-side rendering'));
    }

    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return demo response
        const newLeave: Leave = {
          id: Date.now().toString(),
          employeeId: user.id,
          leaveType: request.leaveType,
          startDate: request.startDate,
          endDate: request.endDate,
          days: Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
          reason: request.reason,
          status: 'pending',
          appliedDate: new Date().toISOString().split('T')[0]
        };
        return of(newLeave).pipe(delay(800));
      }
    }

    // Real API call
    if (!userData) {
      return throwError(() => new Error('User not authenticated'));
    }

    const user = JSON.parse(userData);
    const leaveData = {
      employeeId: user.id,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      days: Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    };

    return this.http.post<Leave>(`${this.API_URL}/AddLeave`, leaveData)
      .pipe(catchError(this.handleError));
  }

  getLeaveBalance(): Observable<LeaveBalance> {
    // Check if running in browser (localStorage not available during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return of({ annual: 0, sick: 0, casual: 0, maternity: 0, unpaid: 0 });
    }

    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return demo balance
        const balance: LeaveBalance = {
          annual: 25,
          sick: 10,
          casual: 5,
          maternity: user.role === 'employee' ? 90 : 0,
          unpaid: 0
        };
        return of(balance).pipe(delay(300));
      }
    }

    // For real API, we'd need to implement this endpoint
    // For now, return demo data
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
    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return demo pending approvals
        const pendingLeaves = this.getDemoLeaves(user).filter(leave => leave.status === 'pending');
        // Add some additional pending leaves from other employees for managers
        if (user.role === 'manager' || user.role === 'admin' || user.role === 'hr') {
          pendingLeaves.push({
            id: '4',
            employeeId: '999',
            leaveType: 'annual' as LeaveType,
            startDate: '2026-01-22',
            endDate: '2026-01-25',
            days: 4,
            reason: 'Vacation',
            status: 'pending' as LeaveStatus,
            appliedDate: '2026-01-19'
          });
        }
        return of(pendingLeaves).pipe(delay(600));
      }
    }

    // Real API call
    if (!userData) {
      return throwError(() => new Error('User not authenticated'));
    }

    const user = JSON.parse(userData);
    return this.http.get<Leave[]>(`${this.API_URL}/GetAllLeavesByManagerId?managerId=${user.id}`)
      .pipe(catchError(this.handleError));
  }

  approveLeave(action: ApprovalAction): Observable<Leave> {
    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - simulate approval
        const leave: Leave = {
          id: action.leaveId,
          employeeId: '999', // Some other employee
          leaveType: 'annual' as LeaveType,
          startDate: '2026-01-22',
          endDate: '2026-01-25',
          days: 4,
          reason: 'Vacation',
          status: action.action === 'approve' ? 'approved' as LeaveStatus : 'rejected' as LeaveStatus,
          appliedDate: '2026-01-19',
          approvedDate: new Date().toISOString().split('T')[0],
          approvedBy: user.name,
          comments: action.comments
        };
        return of(leave).pipe(delay(800));
      }
    }

    // Real API call
    if (!userData) {
      return throwError(() => new Error('User not authenticated'));
    }

    const user = JSON.parse(userData);
    const updateData = {
      leaveId: action.leaveId,
      status: action.action === 'approve' ? 'approved' : 'rejected',
      approvedBy: user.id,
      approvedDate: new Date().toISOString().split('T')[0],
      comments: action.comments || ''
    };

    return this.http.put<Leave>(`${this.API_URL}/UpdateLeave`, updateData)
      .pipe(catchError(this.handleError));
  }

  getTeamLeaves(): Observable<Leave[]> {
    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return team leaves
        const teamLeaves = [
          ...this.getDemoLeaves(user),
          {
            id: '5',
            employeeId: '999',
            leaveType: 'sick' as LeaveType,
            startDate: '2026-01-28',
            endDate: '2026-01-30',
            days: 3,
            reason: 'Flu',
            status: 'approved' as LeaveStatus,
            appliedDate: '2026-01-25',
            approvedDate: '2026-01-26',
            approvedBy: user.name
          }
        ];
        return of(teamLeaves).pipe(delay(500));
      }
    }

    // Real API call
    if (!userData) {
      return throwError(() => new Error('User not authenticated'));
    }

    const user = JSON.parse(userData);
    return this.http.get<Leave[]>(`${this.API_URL}/GetAllLeavesByManagerId?managerId=${user.id}`)
      .pipe(catchError(this.handleError));
  }

  // HR/Admin functions
  getAllLeaves(filters?: any): Observable<Leave[]> {
    // Check if user is demo user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id.startsWith('demo-token-') || user.id.length === 1) {
        // Demo user - return all demo leaves
        const allLeaves = [
          ...this.getDemoLeaves(user),
          {
            id: '6',
            employeeId: '999',
            leaveType: 'casual' as LeaveType,
            startDate: '2026-02-05',
            endDate: '2026-02-06',
            days: 2,
            reason: 'Personal',
            status: 'approved' as LeaveStatus,
            appliedDate: '2026-02-01',
            approvedDate: '2026-02-03',
            approvedBy: 'Manager'
          },
          {
            id: '7',
            employeeId: '888',
            leaveType: 'annual' as LeaveType,
            startDate: '2026-02-10',
            endDate: '2026-02-15',
            days: 6,
            reason: 'Holiday',
            status: 'pending' as LeaveStatus,
            appliedDate: '2026-02-08'
          }
        ];
        return of(allLeaves).pipe(delay(700));
      }
    }

    // Real API call
    return this.http.get<Leave[]>(`${this.API_URL}/GetAllLeaves`)
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

  private getDemoLeaves(user: any): Leave[] {
    const baseLeaves: Leave[] = [
      {
        id: '1',
        employeeId: user.id,
        leaveType: 'annual' as LeaveType,
        startDate: '2026-01-15',
        endDate: '2026-01-20',
        days: 6,
        reason: 'Family vacation',
        status: 'approved' as LeaveStatus,
        appliedDate: '2026-01-10',
        approvedDate: '2026-01-12',
        approvedBy: 'Manager'
      },
      {
        id: '2',
        employeeId: user.id,
        leaveType: 'sick' as LeaveType,
        startDate: '2026-02-01',
        endDate: '2026-02-03',
        days: 3,
        reason: 'Medical appointment',
        status: 'pending',
        appliedDate: '2026-01-18'
      }
    ];

    // Add role-specific leaves
    if (user.role === 'manager' || user.role === 'admin') {
      baseLeaves.push({
        id: '3',
        employeeId: user.id,
        leaveType: 'casual' as LeaveType,
        startDate: '2026-01-25',
        endDate: '2026-01-26',
        days: 2,
        reason: 'Personal work',
        status: 'approved',
        appliedDate: '2026-01-20',
        approvedDate: '2026-01-22',
        approvedBy: 'HR'
      });
    }

    return baseLeaves;
  }
}