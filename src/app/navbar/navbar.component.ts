import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { UIService } from '../services/ui.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink], 
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    private uiService = inject(UIService);

    goToConnection(): void {
        this.uiService.toggleLoginScreen();
    }
}