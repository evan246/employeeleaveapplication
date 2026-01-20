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

  constructor(private leaveService: LeaveService, private router: Router) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.isLoading = true;
    this.errorMessage = '';
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-status-approved-bg text-status-approved-text';
      case 'pending': return 'bg-status-pending-bg text-status-pending-text';
      case 'rejected': return 'bg-status-rejected-bg text-status-rejected-text';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  applyNewLeave() {
    this.router.navigate(['/leave/apply']);
  }
}