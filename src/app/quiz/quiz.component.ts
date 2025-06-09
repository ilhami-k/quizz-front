import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; 
import { QuizzService } from '../services/quizz.service';
import { Quiz } from '../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  private quizzService = inject(QuizzService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute);
  quizzes: Quiz[] = [];
  categoryId: number | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  categoryName: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    const idParam = params.get('id'); 
    this.categoryId = idParam ? Number(idParam) : null;

    if (this.categoryId !== null) {
      this.loadQuizzesByCategory();
      } 
    else {
      this.loadQuizzes();}
    });
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.error = null;
    this.quizzService.getQuizzes().subscribe({
      next: (data: Quiz[]) => {
        this.quizzes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
        this.error = 'Failed to load quizzes. Please try again later.';
        if (err.status === 0) {
          this.error = 'Could not connect to the server. Please ensure the backend is running and CORS is configured.';
        } else if (err.message) {
            this.error = `Failed to load quizzes: ${err.message}`;
        }
        this.isLoading = false;
      }
    });
  }

loadQuizzesByCategory(): void {
  this.isLoading = true;
  this.error = null;

  this.quizzService.getQuizzesByCategoryId(this.categoryId!).subscribe({
    next: (quizzes) => {
      this.quizzes = quizzes;
      this.isLoading = false;

        if (quizzes.length > 0 && quizzes[0].category?.name) {
          this.categoryName = quizzes[0].category.name;
        } else {
          this.categoryName = 'Catégorie inconnue';
        }
    },
    error: (err) => {
      console.error('Error loading quizzes:', err);
      this.error = 'Erreur lors du chargement des quiz.';
      this.isLoading = false;
    }
  });
}

  viewQuizDetails(quizId: number): void {
    console.log('Attempting to navigate to details for quizId:', quizId);
    if (quizId === undefined || quizId === null) {
      console.error('Navigation aborted: quizId is undefined or null.');
      this.error = 'Cannot view details for this quiz as its ID is missing.';
      return;
    }
    this.router.navigate(['/quiz', quizId]);
  }
  createQuiz(): void {
    this.router.navigate(['quiz/create']);
  }
}