import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}