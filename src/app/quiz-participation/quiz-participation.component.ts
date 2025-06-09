import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzService } from '../services/quizz.service';
import { Quiz, QuizQuestion } from '../models/quiz.model';
import { UserAnswer, QuizSubmission } from '../models/quiz-participation.model';

@Component({
  selector: 'app-quiz-participation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-participation.component.html',
  styleUrls: ['./quiz-participation.component.css']
})
export class QuizParticipationComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizzService = inject(QuizzService);

  quiz: Quiz | null = null;
  currentQuestionIndex: number = 0;
  userAnswers: UserAnswer[] = [];
  selectedAnswerId: number | null = null;
  isLoading = true;
  quizFinished = false;
  error: string | null = null; 
  submissionError: string | null = null;

  // --- New properties to store results ---
  finalScore: number | null = null;
  totalQuestions: number | null = null;
  resultMessage: string | null = null;
  // ------------------------------------

  ngOnInit(): void {
    // ... (this method remains the same)
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        this.isLoading = true;
        this.quizzService.getQuizById(+idString).subscribe({
          next: (data) => {
            if (data && data.questions && data.questions.length > 0) {
              this.quiz = data;
            } else {
              this.error = 'This quiz does not have any questions or could not be loaded.';
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.error = `Failed to load quiz. Error: ${err.message}`;
            this.isLoading = false;
          }
        });
      } else {
        this.error = 'No Quiz ID provided in the URL.';
        this.isLoading = false;
      }
    });
  }

  // --- MODIFIED submitAnswers method ---
  submitAnswers(): void {
    if (!this.quiz?.quizId) {
      this.submissionError = 'Cannot submit answers: Quiz ID is missing.';
      return;
    }

    const submission: QuizSubmission = {
      quizId: this.quiz.quizId,
      answers: this.userAnswers,
    };
    
    this.quizzService.submitQuiz(submission).subscribe({
      next: (response) => {
        console.log('Submission successful', response);
        // Instead of navigating, set the result properties
        this.finalScore = response.score;
        this.totalQuestions = response.totalQuestions;
        this.resultMessage = response.message;
      },
      error: (err) => {
        this.submissionError = `Failed to submit quiz. Error: ${err.message}`;
        console.error('Submission failed', err);
      }
    });
  }
  
  // --- New method to navigate back to the quiz list ---
  goBackToQuizzes(): void {
    this.router.navigate(['/quiz']);
  }

  // ... (the other methods like nextQuestion, selectAnswer, etc., remain the same)
  get currentQuestion(): QuizQuestion | undefined {
    return this.quiz?.questions?.[this.currentQuestionIndex];
  }

  selectAnswer(answerId: number | undefined): void {
    if (answerId !== undefined) {
      this.selectedAnswerId = answerId;
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === (this.quiz?.questions?.length ?? 0) - 1;
  }

  nextQuestion(): void {
    if (this.selectedAnswerId === null || !this.currentQuestion?.questionId) {
      return;
    }

    this.userAnswers.push({
      questionId: this.currentQuestion.questionId,
      answerId: this.selectedAnswerId,
    });

    if (this.isLastQuestion()) {
      this.finishQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedAnswerId = null;
    }
  }

  finishQuiz(): void {
    this.quizFinished = true;
    this.submitAnswers();
  }
}