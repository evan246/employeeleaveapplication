import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { Leave } from '../../models/leave.model';

@Component({
  selector: 'app-my-leave-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-leave-requests.component.html',
  styleUrls: ['./my-leave-requests.component.scss']
})
export class MyLeaveRequestsComponent implements OnInit {
  leaves: Leave[] = [];
  isLoading = true;
  errorMessage = '';
  activeTab: 'my-leaves' | 'leave-requests' = 'leave-requests';

  constructor(private leaveService: LeaveService, private router: Router) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.activeTab === 'leave-requests') {
      this.leaveService.getPendingApprovals().subscribe({
        next: (leaves: any) => {
          this.leaves = leaves;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'Failed to load pending approvals.';
          this.isLoading = false;
        }
      });
    } else {
      this.leaveService.getMyLeaves().subscribe({
        next: (leaves: any) => {
          this.leaves = leaves;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'Failed to load leave requests.';
          this.isLoading = false;
        }
      });
    }
  }

  showMyLeaves() {
    this.activeTab = 'my-leaves';
    this.loadLeaves();
  }

  showLeaveRequests() {
    this.activeTab = 'leave-requests';
    this.loadLeaves();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  applyNewLeave() {
    this.router.navigate(['/leave/apply']);
  }

  approveLeave(leaveId: string) {
    this.leaveService.approveLeave({ leaveId, action: 'approve' }).subscribe({
      next: (result) => {
        console.log('Leave approved:', result);
        // Refresh the data to show updated status
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error approving leave:', error);
        // TODO: Show error message to user
      }
    });
  }

  rejectLeave(leaveId: string) {
    this.leaveService.approveLeave({ leaveId, action: 'reject' }).subscribe({
      next: (result) => {
        console.log('Leave rejected:', result);
        // Refresh the data to show updated status
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error rejecting leave:', error);
        // TODO: Show error message to user
      }
    });
  }
}