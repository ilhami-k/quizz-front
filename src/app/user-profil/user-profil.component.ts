import { Component, OnInit, inject } from '@angular/core'; 
import { UserProfilService } from '../services/user-profil.service';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'] 
})
export class UserProfilComponent implements OnInit {
  user: User | null = null; 
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isEditing: boolean = false;
  userForm!: FormGroup;
  
  constructor(
    private userProfilService: UserProfilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
      this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    const userId = this.authService.getCurrentUserId(); 
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
        this.user = data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', err);
        this.errorMessage = "Impossible de charger les détails de l'utilisateur. ";
        if (err.status === 404) {
            this.errorMessage += "L'utilisateur n'a pas été trouvé.";
        } else if (err.status === 0 || err.status === 500) { 
            this.errorMessage += "Problème de connexion au serveur ou erreur serveur.";
        } else {
            this.errorMessage += `Erreur: ${err.message || 'Inconnue'}`;
        }
        this.isLoading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = null; 
    this.successMessage = null;

    if (this.isEditing && this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email
      });
    }
  } 

  saveProfile(): void {
    if (this.userForm.invalid || !this.user) {
      this.errorMessage = "Veuillez remplir tous les champs correctement.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const updatedData = {
      userId : this.user.userId,
      username: this.userForm.value.username,
      email: this.userForm.value.email
    }
    

    /*const userIdAsNumber = Number(this.user.userId);*/

    this.userProfilService.UpdateUser(this.user.userId, updatedData).subscribe({
      next: (reponse) => {
        this.user = reponse;

        const currentUser = this.authService.getLoggedInUser();
        if (currentUser) {
            const updatedUserForAuth = { ...currentUser, ...updatedData };
            const token = localStorage.getItem('authToken');
            if(token) this.authService.setLoggedIn(true, token, updatedUserForAuth);
        }

        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = "Profil mis à jour avec succès !";
      },

      
      error: (err) => {
        console.error("Erreur lors de la mise à jour du profil:", err);
        this.errorMessage = "La mise à jour a échoué. Veuillez réessayer.";
        this.isLoading = false;
      }
    });
  }

  deleteProfile(): void {
    const isconfirmed = confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
    if (isconfirmed && this.user){
      this.userProfilService.deleteUser(this.user.userId).subscribe({
        next: () => {
          alert("Votre compte a été supprimé avec succès.");
          this.authService.logout();
          this.router.navigate(['/']);
          
    },
    error: (err) => {
          console.error("Erreur lors de la suppression du profil:", err);
          alert("La suppression du compte a échoué.");
        }
      });
    }
  }
} 