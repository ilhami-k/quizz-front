import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizzService } from '../services/quizz.service';
import { AuthService } from '../services/auth.service';
import { Quiz, Category, Answer, QuizQuestion } from '../models/quiz.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-quiz-creation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './quiz-creation.component.html',
  styleUrls: ['./quiz-creation.component.css']
})
export class QuizCreationComponent implements OnInit {
  quizForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  private quizzService = inject(QuizzService);
  public authService = inject(AuthService);
  private router = inject(Router);

  categories: Category[] = [
    { categoryId: 1, name: "Science Générale" },
    { categoryId: 2, name: "Histoire" },
    { categoryId: 3, name: "Mathématiques" },
    { categoryId: 4, name: "Capitales Européennes" },
    { categoryId: 5, name: "Pièces de Shakespeare" },
    { categoryId: 10, name: "Culture Générale" },
    { categoryId: 11, name: "Technologie Moderne" },
  ];

  difficultyLevels: string[] = ["Easy", "Medium", "Hard", "Expert"];

  questionTypes = [
    { value: 0, name: "Multiple Choice (Single Correct)" },
    { value: 1, name: "True/False" }
  ];

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.errorMessage = "You must be logged in to create a quiz. Please log in or register.";
    }

    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      difficultyLevel: ['', Validators.required],
      isVisible: [true],
      questions: this.fb.array([this.createQuestionFormGroup()])
    });
  }

  get questionsFormArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionFormGroup(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      questionType: [1, Validators.required],
      timer: [30, [Validators.required, Validators.min(5), Validators.max(300)]],
      answers: this.fb.array([
        this.createAnswerFormGroup(),
        this.createAnswerFormGroup()
      ])
    });
  }

  addQuestion(): void {
    this.questionsFormArray.push(this.createQuestionFormGroup());
  }

  removeQuestion(questionIndex: number): void {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(questionIndex);
    } else {
      this.errorMessage = "A quiz must have at least one question.";
    }
  }

  answersFormArray(questionIndex: number): FormArray {
    const questionControl = this.questionsFormArray.at(questionIndex);
    if (questionControl) {
        return questionControl.get('answers') as FormArray;
    }
    return this.fb.array([]);
  }

  createAnswerFormGroup(isCorrectDefault = false): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [isCorrectDefault, Validators.required]
    });
  }

  addAnswer(questionIndex: number): void {
    const answers = this.answersFormArray(questionIndex);
    if (answers.length < 6) {
        answers.push(this.createAnswerFormGroup());
    } else {
        this.errorMessage = "Maximum of 6 answers per question.";
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.answersFormArray(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
    } else {
      this.errorMessage = "A question must have at least two answer options.";
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.authService.isLoggedIn) {
      this.errorMessage = "Authentication error. Please log in again.";
      this.router.navigate(['/connexion']);
      return;
    }

    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      this.errorMessage = "Please fill out all required fields correctly. Check the debug info if visible.";
      return;
    }

    const questionsValue = this.quizForm.value.questions;
    for (let i = 0; i < questionsValue.length; i++) {
      const question = questionsValue[i];
      const correctAnswersCount = question.answers.filter((ans: Answer) => ans.isCorrect).length;
      if (correctAnswersCount !== 1) {
        this.errorMessage = `Question ${i + 1} must have exactly one correct answer.`;
        this.isLoading = false;
        return;
      }
      if (question.questionType === 1 && question.answers.length !== 2) {
      }
    }

    this.isLoading = true;
    const formValue = this.quizForm.value;

    let numericDifficulty: number;
    switch (formValue.difficultyLevel) {
      case "Easy": numericDifficulty = 0; break;
      case "Medium": numericDifficulty = 1; break;
      case "Hard": numericDifficulty = 2; break;
      case "Expert": numericDifficulty = 3; break;
      default:
        this.errorMessage = "Invalid difficulty level selected.";
        this.isLoading = false;
        return;
    }

    const loggedInUser = this.authService.getLoggedInUser();

    if (!loggedInUser || typeof loggedInUser.userId === 'undefined') {
        this.errorMessage = "User ID not found. Please ensure you are logged in correctly.";
        this.isLoading = false;
        return;
    }

    const quizPayloadForBackend = {
      quizId: 0,
      title: formValue.title,
      description: formValue.description,
      categoryId: +formValue.categoryId,
      dificulty: numericDifficulty,
      userId: loggedInUser.userId,
      isVisible: formValue.isVisible,
      questions: formValue.questions.map((q: any) => ({
        questionText: q.questionText,
        questionType: +q.questionType,
        timer: +q.timer,
        answers: q.answers.map((a: { answerText: string, isCorrect: boolean }) => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect
        }))
      }))
    };

    console.log('Submitting Final Quiz Data to Server:', JSON.stringify(quizPayloadForBackend, null, 2));

    this.quizzService.createQuizzes(quizPayloadForBackend as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Quiz created successfully! Redirecting...';
        console.log('Quiz creation successful:', response);
        this.quizForm.reset({
            difficultyLevel: '',
            categoryId: null,
            isVisible: true
        });
        while (this.questionsFormArray.length !== 0) {
          this.questionsFormArray.removeAt(0);
        }
        this.addQuestion();

        setTimeout(() => {
          this.router.navigate(['/quiz']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Quiz creation failed:', err);
        if (err.error && typeof err.error === 'string') {
            this.errorMessage = `Server Error: ${err.error}`;
        } else if (err.error && err.error.message) {
          this.errorMessage = `Server Error: ${err.error.message}`;
        } else if (err.statusText && err.status) {
           this.errorMessage = `Error: ${err.status} - ${err.statusText}.`;
        } else {
          this.errorMessage = 'An unexpected error occurred during quiz creation.';
        }
      }
    });
  }
}