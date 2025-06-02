import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private api_url = "https://localhost:7223/users/register";
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  register(userData: any): Observable<any> {
    // userData devrait être un objet { username, email, password, confirmPassword }
    return this.http.post(this.api_url, userData);
  }
}