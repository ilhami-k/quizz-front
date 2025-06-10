import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserProfilService {
  private http: HttpClient = inject(HttpClient);


  private apiUrl = 'http://4.180.236.182:5000/users';

  constructor() { }

  getUserbyId(id: number): Observable<User> { // Type de retour modifié en Observable<User>
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  UpdateUser(id: number, userData: Partial<User>): Observable<any> {
  return this.http.put(`${this.apiUrl}/update/${id}`, userData)
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }


}