import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UIService {
    public showLoginScreen: boolean = false;

    toggleLoginScreen() {
        this.showLoginScreen = !this.showLoginScreen;
    }
}