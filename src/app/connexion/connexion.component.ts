import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] 
})
export class ConnexionComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  confPassword = '';
  email = ''
  isLogin: boolean = true // pour commencer en mode login lorsqu'on clique sur "connexion"
  private authService :AuthService = inject(AuthService)

  ngOnInit(): void {
  }
  login() {
    this.errorMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login failed', error);
      }
    });
  }
  signUp (): void {
    this.errorMessage = '';
    if (!this.username || !this.email || !this.password || !this.confPassword) {
      this.errorMessage = 'All fields are required for signup.';
      return;
    }
    if (this.password !== this.confPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
    }
    //TODO Pour la suite j'aurai besoin d'un bon backend pour pouvoir inscrire des utilisateurs:

  }
  switchStates (): void {
    this.isLogin = !this.isLogin
    //! pour remettre les champs a 0 apres switch
    this.errorMessage = ''
    this.username = ''
    this.password = ''
    this.confPassword = ''
    this.email = '' 
  }

}
