import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'employeeleaveapp';
  showSidebar = false;
  isAuthRoute = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check sidebar visibility on route changes and auth state changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthRoute = event.url.startsWith('/auth');
      this.updateSidebarVisibility();
    });

    this.authService.currentUser$.subscribe(() => {
      this.updateSidebarVisibility();
    });
  }

  private updateSidebarVisibility() {
    const hasUser = !!this.authService.getCurrentUser();
    
    // Show sidebar only if user is authenticated AND not on auth routes
    this.showSidebar = hasUser && !this.isAuthRoute;
  }
}
