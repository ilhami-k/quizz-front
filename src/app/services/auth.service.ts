import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url =  "http://4.180.236.182:5000/users/auth";
  private http: HttpClient = inject(HttpClient);
  public isLoggedIn: boolean = false;
  private currentUser: User | null = null; 

  constructor(){
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    this.isLoggedIn = !!token;

    if (this.isLoggedIn && typeof localStorage !== 'undefined') {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            this.currentUser = JSON.parse(userStr) as User;
        } else {
            this.logout(); 
        }
    }

  }

  setLoggedIn(status: boolean, token?: string, user?: User): void {
    if (typeof localStorage !== 'undefined') {
        if (status && token && user) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            this.isLoggedIn = true; 
        } else if (!status) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          this.currentUser = null;
          this.isLoggedIn = false; 
        }
    } else { 
        this.isLoggedIn = status;
        if(status && user) this.currentUser = user;
        if(!status) this.currentUser = null;
    }
  }

  login(username:string,password:string): Observable<any> {
    return this.http.post<any>(this.api_url,{username:username,password:password});
  }

  logout(): void {
     if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
     }
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  getLoggedInUser(): User | null {
    if (!this.currentUser && this.isLoggedIn && typeof localStorage !== 'undefined') {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            this.currentUser = JSON.parse(userStr) as User;
        }
    }
    return this.currentUser;
  }

  getCurrentUserId(): number | null {
    const user = this.getLoggedInUser();
    return user ? user.userId : null;
  }

  getCurrentUsername(): string | null {
    const user = this.getLoggedInUser();
    return user ? user.username : null;
  }

}