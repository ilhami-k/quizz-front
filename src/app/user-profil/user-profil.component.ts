import { Component, OnInit, inject } from '@angular/core'; // OnInit injecté
import { UserProfilService } from '../services/user-profil.service';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service'; // AuthService importé
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profil',
  standalone: true, // Assurez-vous que c'est le cas ou ajustez selon votre structure (NgModule)
  imports: [CommonModule, FormsModule], // CommonModule est nécessaire pour *ngIf, etc.
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'] // Assurez-vous que ce fichier existe
})
export class UserProfilComponent implements OnInit {
  user: User | null = null; // Modifié pour un seul utilisateur ou null
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // Injection des services via le constructeur
  constructor(
    private userProfilService: UserProfilService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUserId(); // Récupère l'ID de l'utilisateur connecté
    if (userId !== null) {
      this.fetchUserById(userId);
    } else {
      this.errorMessage = "Utilisateur non connecté. Impossible de charger le profil.";
      console.error("User ID is null, cannot fetch profile.");
    }
  }

  fetchUserById(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.userProfilService.getUserbyId(id).subscribe({
      next: (data: User) => {
        this.user = data; // Assigne les données utilisateur reçues
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', err);
        this.errorMessage = "Impossible de charger les détails de l'utilisateur. ";
        if (err.status === 404) {
            this.errorMessage += "L'utilisateur n'a pas été trouvé.";
        } else if (err.status === 0 || err.status === 500) { // Gère aussi les erreurs serveur internes
            this.errorMessage += "Problème de connexion au serveur ou erreur serveur.";
        } else {
            this.errorMessage += `Erreur: ${err.message || 'Inconnue'}`;
        }
        this.isLoading = false;
      }
    });
  }
}