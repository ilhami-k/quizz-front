import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UIService } from '../services/ui.service';
import { AuthService } from '../services/auth.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, CommonModule, DashboardComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    //*private uiService = inject(UIService); je le garde au cas ou on en aura besoin
    authService = inject(AuthService);
    private elementRef = inject(ElementRef);
    showDashboard = false;
    /*goToConnection(): void {
        this.uiService.toggleLoginScreen();
    }*/
    toggleDashboard(event: MouseEvent): void {
        event.stopPropagation();
        this.showDashboard = !this.showDashboard;
    }
    closeDashboard(): void {
        this.showDashboard = false;
    }
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDashboard();
        }
    }
}