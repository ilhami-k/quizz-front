import { CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { Category } from '../models/quiz.model';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories: Category[] = [];
  isLoading: boolean = true;
  

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.isLoading = false;
      }
    });
  }
  viewQuizzesByCategory(categoryId: number): void {
    console.log('Attempting to navigate to quizzes for categoryId:', categoryId);
    if (categoryId === undefined || categoryId === null) {
      console.error('Navigation aborted: categoryId is undefined or null.');
      return;
    }
    this.router.navigate(['/quiz/category', categoryId]);
    }
}
