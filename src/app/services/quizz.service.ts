import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizzService { 

  constructor() { }
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'http://4.180.236.182:5000/quizzes';

  getQuizzes (): Observable <any> {
    return this.http.get<any>(this.apiUrl);
  }
  getQuizById(id:number): Observable <any> {
    return this.http.get<any> (`${this.apiUrl}/${id}`);
  }
}
