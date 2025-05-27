import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profil',
  imports: [FormsModule,],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.css'
})
export class UserProfilComponent {

  user = {
    name: 'John Doe',
    email: 'jeandupont@gmailcom',
  }

    //visuel logique front en attendant le back 
  editedUser = { ...this.user };

  saveChanges() {
    this.user = { ...this.editedUser };
    alert('Profil mis à jour (en front uniquement)');

    }
  }
