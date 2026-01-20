import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to send reset email. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email.';
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}