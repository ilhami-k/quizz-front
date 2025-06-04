import { Component } from '@angular/core';
import { UserProfilService, } from '../services/user-profil.service';
import { UserProfil } from '../models/UserProfil.model';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profil',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.css'
})
export class UserProfilComponent {
  user! : UserProfil; 
  userId: number = 1;

  constructor(private userProfilService: UserProfilService) {}

  ngOnInit() {
    this.getUserById();
  }

  getUserById() : void {
    this.userProfilService.getUserbyId(this.userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Erreur:', err);
        
      }
    });
  }
}