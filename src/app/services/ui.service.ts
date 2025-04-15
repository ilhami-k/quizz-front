import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UIService {
    // Gère l'état de visibilité (affiché/masqué) de l'écran de connexion pour l'application.
    showLoginScreen = new BehaviorSubject<boolean>(false);

    toggleLoginScreen() {
        this.showLoginScreen.next(!this.showLoginScreen.value);
    }
}