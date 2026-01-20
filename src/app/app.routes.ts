import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'leave',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'apply',
        loadComponent: () => import('./leave/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
      },
      {
        path: 'my-requests',
        loadComponent: () => import('./leave/my-leave-requests/my-leave-requests.component').then(m => m.MyLeaveRequestsComponent)
      }
    ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
