// app/connexion/connexion.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UIService } from '../services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ConnexionComponent implements OnInit {
  errorMessage = '';
  isLogin: boolean = true;
  connexionForm!: FormGroup;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private uiService: UIService = inject(UIService);
  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.connexionForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Keep email validation if needed for signup
      password: ['', Validators.required],
      confPassword: ['', Validators.required] // Keep confPassword if needed for signup
    });
    // Ensure validators are updated based on mode if needed later
    // this.updateValidators(this.isLogin);
  }

  login() {
    this.errorMessage = '';
    const usernameControl = this.connexionForm.get('username');
    const passwordControl = this.connexionForm.get('password');

    if (usernameControl?.invalid || passwordControl?.invalid) {
       this.errorMessage = "Nom d'utilisateur et mot de passe requis.";
       this.connexionForm.markAllAsTouched();
       return;
    }
    const { username, password } = this.connexionForm.value;

    console.log('Attempting login for user:', username); // Log attempt

    this.authService.login(username, password).subscribe({
      next: (response) => {
        // Log the raw response from the API
        console.log('Login API Response:', response);

        // Check if the response looks like a successful login (e.g., has necessary fields)
        // The dummyjson API should return user details and a token on success.
        if (response && response.id && response.token) {
          console.log('Login successful, calling setLoggedIn(true)'); // Log before calling
          // Pass the actual token from the response
          this.authService.setLoggedIn(true, response.token);
          // Hide login screen and navigate AFTER setting state
          this.uiService.showLoginScreen = false;
           // Optional: Delay navigation slightly for testing timing issues
           // setTimeout(() => {
           //     console.log('Navigating after delay...');
           //     this.router.navigate(['/']);
           // }, 100);
           // Normal navigation:
           this.router.navigate(['/']);

        } else {
          // Handle cases where API call succeeded (status 200) but response indicates failure
          // or is missing expected data (like the token)
          console.error('Login API call succeeded but response missing token or user data.', response);
          this.errorMessage = 'Erreur de connexion: Réponse invalide du serveur.';
          // Ensure user is logged out if response is bad
          this.authService.setLoggedIn(false);
        }
      },
      error: (error) => {
        console.error('Login failed (HTTP Error):', error); // Log the full error
        // Ensure user is logged out on error
        this.authService.setLoggedIn(false); // Make sure loggedOut state is emitted

        if (error.status === 400) {
           // Specific message for bad credentials from dummyjson
           this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        } else {
          // Generic error for other HTTP issues (network, server error, etc.)
          this.errorMessage = `Une erreur est survenue (${error.status || 'inconnue'}).`;
        }
      }
    });
  }

  signUp(): void {
    this.errorMessage = '';

    if (this.connexionForm.invalid) {
       this.errorMessage = "Veuillez corriger les erreurs pour l'inscription.";
       this.connexionForm.markAllAsTouched();
       return;
    }

    const { username, email, password } = this.connexionForm.value;
    console.log('Attempting signup with:', { username, email, password });
    this.errorMessage = "Fonctionnalité d'inscription non implémentée.";
    // TODO: Pas encore de backend:
  }

  switchStates(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.connexionForm.get('username')?.setErrors(null);
    this.connexionForm.get('email')?.setErrors(null);
    this.connexionForm.get('password')?.setErrors(null);
    this.connexionForm.get('confPassword')?.setErrors(null);
  }


  get username() { return this.connexionForm.get('username'); }
  get email() { return this.connexionForm.get('email'); }
  get password() { return this.connexionForm.get('password'); }
  get confPassword() { return this.connexionForm.get('confPassword'); }
}