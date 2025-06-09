import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Quiz } from '../models/quiz.model';
import { QuizSubmission } from '../models/quiz-participation.model';

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
  createQuizzes(quizData: Quiz): Observable <any> {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization',`Bearer ${token}`)
    }
    return this.http.post<any>(`${this.apiUrl}/create`,quizData, {headers:headers});
  }
  getQuizzesByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}`);
  }
  submitQuiz(submission: QuizSubmission): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    // The endpoint from your curl command
    return this.http.post(`${this.apiUrl}/submit`, submission, { headers });
  }
}
