import { Component, inject } from '@angular/core';
import { CategoriesComponent } from '../categories/categories.component';
import { ConnexionComponent } from '../connexion/connexion.component';
import { CommonModule } from '@angular/common';
import { UIService } from '../services/ui.service';

@Component({
    selector: 'app-home',
    imports: [CategoriesComponent, ConnexionComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    uiService = inject(UIService);
    showLoginScreen = false;
    constructor() {
        this.uiService.showLoginScreen.subscribe(value => this.showLoginScreen = value);
    }
}