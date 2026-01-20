export interface Leave {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  comments?: string;
  attachment?: string;
}

export type LeaveType = 'annual' | 'sick' | 'casual' | 'maternity' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: File;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
  maternity: number;
  unpaid: number;
}

export interface ApprovalAction {
  leaveId: string;
  action: 'approve' | 'reject';
  comments?: string;
}