import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { LeaveType } from '../../models/leave.model';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  leaveTypes: LeaveType[] = ['annual', 'sick', 'casual', 'maternity', 'unpaid'];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null]
    });
  }

  ngOnInit() {
    // Calculate days when dates change
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());
  }

  calculateDays() {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

      // For now, just log. In real app, set a calculated days field
      console.log('Calculated days:', diffDays);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.leaveForm.patchValue({ attachment: file });
    }
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.leaveForm.value;
      const request = {
        leaveType: formValue.leaveType,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        reason: formValue.reason,
        attachment: formValue.attachment
      };

      this.leaveService.applyForLeave(request).subscribe({
        next: (leave: any) => {
          this.isLoading = false;
          this.successMessage = 'Leave application submitted successfully!';
          this.leaveForm.reset();
          // Optionally navigate to leave requests page
          setTimeout(() => {
            this.router.navigate(['/leave/my-requests']);
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to submit leave application. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}