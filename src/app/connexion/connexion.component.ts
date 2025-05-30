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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confPassword: ['', Validators.required]
    });
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


    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response && response.user && response.user.userId && response.authToken) {
          this.authService.setLoggedIn(true, response.authToken);
          this.uiService.showLoginScreen = false;
           this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Erreur de connexion: Réponse invalide du serveur. Structure attendue non conforme.';
          this.authService.setLoggedIn(false);
        }
      },
      error: (error) => {
        this.authService.setLoggedIn(false);

        if (error.status === 400) {
           this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        } else {
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
    this.errorMessage = "Fonctionnalité d'inscription non implémentée.";
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