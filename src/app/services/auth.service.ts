import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url =  "https://dummyjson.com/auth/login";
  private http: HttpClient = inject(HttpClient);
  public isLoggedIn: boolean = false;
  constructor(){
    this.isLoggedIn = this.hasToken();
    console.log('AuthService Constructor - Initial isLoggedIn:', this.isLoggedIn);
  }
  private hasToken(): boolean {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token !== null;
  }
  setLoggedIn(status: boolean, token?: string): void {
    const previousStatus = this.isLoggedIn;
    if (typeof localStorage !== 'undefined') {
        if (status && token) {
            localStorage.setItem('authToken', token);
        }
        else if (!status) {
          localStorage.removeItem('authToken');
        }
    }
    if (previousStatus !== status) {
        this.isLoggedIn = status;
        console.log('AuthService - isLoggedIn updated to:', this.isLoggedIn);
    }
  }
  login(username:string,password:string): Observable<any> {
    return this.http.post<any>(this.api_url,{username:username,password:password});
  }
  logout(): void{
     const wasLoggedIn = this.isLoggedIn;
     if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
     }
    this.isLoggedIn = false;
    if (wasLoggedIn) {
        console.log('AuthService - logged out, isLoggedIn updated to:', this.isLoggedIn);
    }

  }
  //TODO signUp (email:string, username:string, password:string): Observable <any> {}
}