import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  token = '';

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  getPasswordStrength(password: string): string {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthClass(strength: string): string {
    switch (strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  getPasswordStrengthBarClass(strength: string): string {
    switch (strength) {
      case 'weak': return 'bg-red-500 w-1/3';
      case 'medium': return 'bg-yellow-500 w-2/3';
      case 'strong': return 'bg-green-500 w-full';
      default: return 'bg-gray-400 w-0';
    }
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to reset password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please ensure passwords match and meet requirements.';
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}