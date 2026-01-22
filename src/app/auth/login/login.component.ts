import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const credentials = this.loginForm.value;
      console.log('Attempting login with:', credentials);

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          console.log('Current user after login:', this.authService.getCurrentUser());
          this.isLoading = false;
          
          // Wait a bit for auth state to update before navigating
          setTimeout(() => {
            console.log('Navigating to dashboard...');
            this.router.navigate(['/dashboard']).then(success => {
              console.log('Navigation success:', success);
              if (!success) {
                console.error('Navigation failed');
                this.errorMessage = 'Navigation failed. Please try again.';
              }
            });
          }, 100);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid:', this.loginForm.errors);
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}