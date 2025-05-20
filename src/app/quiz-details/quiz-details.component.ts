import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzService } from '../services/quizz.service';
import { Quiz } from '../models/quiz.model';
import { tap,catchError,pipe,switchMap,of } from 'rxjs';

@Component({
  selector: 'app-quiz-details',
  imports: [CommonModule],
  templateUrl: './quiz-details.component.html',
  styleUrl: './quiz-details.component.css'
})
export class QuizDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizzService = inject(QuizzService);
  quiz: Quiz | null = null;
  isLoading: boolean = true
  error:string | null = null;


  ngOnInit(): void {
      this.route.paramMap.pipe(
        tap(() => {
          this.isLoading = true; // ca reset chaque fois qu'il y a un nouveau ID
          this.error = null;
          this.quiz = null;
        }),
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this.quizzService.getQuizById(+id).pipe(
              catchError(err => {
                console.error('Error fetching detials',err);
                this.error = `Failed to load quizz details. Status: ${err.status}`;
                if (err.status === 0) {
                  this.error = `Could not connect to the server`
                }
                if (err.status === 404) {
                  this.error = "Could not find the ID, might've been deleted"
                }
                this.isLoading = false;
                return of(null)
               })
            );

          } else {
            this.error = 'Id not provided in the root';
            this.isLoading = false;
            return of(null)
          }
        })
      ).subscribe({
        next: (data) => {
          this.quiz = data;
          this.isLoading = false;
          if(!data && !this.error) {
            this.error = 'Quiz Data could not be loaded';

          }

        },
        error: (streamError) => {
          console.error('Stream error while fetching the data',streamError);
          this.error = 'An unexpected error happened';
          this.isLoading = false;

        }
      });
  }
  goBack(): void {
    this.router.navigate(['/quiz']);

  }
  startActualQuiz(quizId: number | undefined): void {
    if (!quizId) return;
    console.log(`Starting actual quiz for ID: ${quizId}`);
    // this.router.navigate(['/take-quiz', quizId]);
  }

  

}
