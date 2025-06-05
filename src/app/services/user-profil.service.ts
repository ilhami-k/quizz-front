import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class UserProfilService {
  private http: HttpClient = inject(HttpClient);
  // Ajustez cette URL si votre endpoint pour récupérer un utilisateur par ID est différent.
  // Supposant une cohérence avec AuthService et QuizzService.
  private apiUrl = 'http://4.180.236.182:5000/users';

  constructor() { }

  getUserbyId(id: number): Observable<User> { // Type de retour modifié en Observable<User>
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}