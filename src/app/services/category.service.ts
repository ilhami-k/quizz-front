import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private api_url = "http://4.180.236.182:5000/categories";
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getAllCategories(): Observable<any> {
    return this.http.get(this.api_url);
  }
}
