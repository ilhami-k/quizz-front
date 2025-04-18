import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private uiService = inject(UIService);

  @Output() closeMenu = new EventEmitter<void>();

  onNavigate(): void {
    this.closeMenu.emit();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu.emit();
    if (this.uiService.showLoginScreen) {
        this.uiService.toggleLoginScreen();
    }
    this.router.navigate(['/']);
  }
}