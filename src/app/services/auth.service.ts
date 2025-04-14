import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url =  "https://dummyjson.com/auth/login"
  private http: HttpClient = inject(HttpClient)  
  login(username:string,password:string): Observable<any> {
    return this.http.post<any>(this.api_url,{username:username,password:password})
  }
  //TODO signUp (email:string, username:string, password:string): Observable <any> {}
}
