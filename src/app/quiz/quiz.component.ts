// src/app/quiz/quiz.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { QuizzService } from '../services/quizz.service'; // Correct path to your service

// Define an interface for the Quiz object for better type safety
export interface Quiz {
  id: number;
  title: string;
  description?: string; // Assuming description is optional
  // Add other properties your quiz object might have
}

@Component({
  selector: 'app-quiz',
  standalone: true, // Ensure it's a standalone component
  imports: [CommonModule], // Add CommonModule for *ngIf, *ngFor
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'] // Corrected styleUrls
})
export class QuizComponent implements OnInit {
  private quizzService = inject(QuizzService);

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
      next: (data: Quiz[]) => { // Use the Quiz interface
        this.quizzes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
        this.error = 'Failed to load quizzes. Please try again later.';
        // You could inspect 'err' for more specific messages from the backend
        if (err.status === 0) {
          this.error = 'Could not connect to the server. Please ensure the backend is running.';
        } else if (err.message) {
            this.error = `Failed to load quizzes: ${err.message}`;
        }
        this.isLoading = false;
      }
    });
  }
}