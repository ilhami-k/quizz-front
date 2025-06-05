import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
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

  quizzes: Quiz[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadQuizzes();
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