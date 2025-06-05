import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UIService } from '../services/ui.service';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { User } from '../models/user.model'; 

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
  private registerService: RegisterService = inject(RegisterService);
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
          this.authService.setLoggedIn(true, response.authToken, response.user as User);
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
        this.errorMessage = "Veuillez remplir correctement tous les champs requis.";
        this.connexionForm.markAllAsTouched();
        return;
    }

    if (this.connexionForm.value.password !== this.connexionForm.value.confPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      this.connexionForm.get('confPassword')?.setErrors({'mismatch': true});
      return;
    }

    const { username, email, password, confPassword } = this.connexionForm.value;

    const userData = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confPassword
    };

    this.registerService.register(userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie !', response);
        this.errorMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.connexionForm.reset();
        this.switchStates();
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription :', error);
        if (error.status === 400 && error.error) {
          this.errorMessage = error.error.message || "Erreur lors de l'inscription. Veuillez vérifier vos informations.";
        }
        else if (error.status === 0) {
          this.errorMessage = "Impossible de se connecter au serveur. Veuillez réessayer plus tard.";
        }
        else {
          this.errorMessage = `Une erreur inattendue est survenue (${error.status || 'inconnue'}).`;
        }
      }
    });
  }

  switchStates(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.connexionForm.reset();
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