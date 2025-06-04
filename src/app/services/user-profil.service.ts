import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';  


@Injectable({
  providedIn: 'root'
})
export class UserProfilService {
 
  constructor() { }
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'https://localhost:7223/users/';

  getUserbyId(id: number) :Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);

}
}
