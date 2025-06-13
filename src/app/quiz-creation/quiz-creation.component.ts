import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizzService } from '../services/quizz.service';
import { AuthService } from '../services/auth.service';
import { Category, Answer } from '../models/quiz.model';
import { CategoryService } from '../services/category.service';

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
  categoryError: string | null = null;

  private fb = inject(FormBuilder);
  private quizzService = inject(QuizzService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService); 

  categories: Category[] = [];

  difficultyLevels: string[] = ["Facile", "Moyen", "Difficile", "Expert"];

  questionTypes = [
    { value: 0, name: "Choix Multiple (Une seule bonne réponse)" },
    { value: 1, name: "Vrai/Faux" }
  ];

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.errorMessage = "Vous devez être connecté pour créer un quiz. Veuillez vous connecter ou vous inscrire.";
    }
    
    this.loadCategories();

    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      difficultyLevel: ['', Validators.required],
      isVisible: [true],
      questions: this.fb.array([this.createQuestionFormGroup()])
    });
  }

  loadCategories(): void {
    this.categoryError = null;
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.categoryError = 'Le chargement des catégories a échoué. Veuillez réessayer.';
        this.errorMessage = this.categoryError;
      }
    });
  }

  get questionsFormArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionFormGroup(): FormGroup {
    const questionGroup = this.fb.group({
      questionText: ['', Validators.required],
      questionType: [0, Validators.required], 
      timer: [30, [Validators.required, Validators.min(5), Validators.max(300)]],
      answers: this.fb.array([
        this.createAnswerFormGroup(),
        this.createAnswerFormGroup()
      ])
    });

    const questionTypeControl = questionGroup.get('questionType');
    if (questionTypeControl) {
      questionTypeControl.valueChanges.subscribe(type => {
        const answersArray = questionGroup.get('answers') as FormArray;
        if (type === 1) { 
          while (answersArray.length > 2) {
            answersArray.removeAt(answersArray.length - 1);
          }
        }
      });
    }

    return questionGroup;
  }

  addQuestion(): void {
    this.questionsFormArray.push(this.createQuestionFormGroup());
  }

  removeQuestion(questionIndex: number): void {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(questionIndex);
    } else {
      this.errorMessage = "Un quiz doit comporter au moins une question.";
    }
  }

  answersFormArray(questionIndex: number): FormArray {
    return this.questionsFormArray.at(questionIndex).get('answers') as FormArray;
  }

  createAnswerFormGroup(isCorrectDefault = false): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [isCorrectDefault, Validators.required]
    });
  }

  addAnswer(questionIndex: number): void {
    this.errorMessage = null;
    const answers = this.answersFormArray(questionIndex);
    const questionType = this.questionsFormArray.at(questionIndex).get('questionType')?.value;

    if (questionType === 1 && answers.length >= 2) {
      this.errorMessage = "Pour une question Vrai/Faux, seulement deux réponses sont autorisées.";
      return;
    }

    if (answers.length >= 6) {
        this.errorMessage = "Maximum de 6 options de réponse par question.";
        return;
    }
    
    answers.push(this.createAnswerFormGroup());
  }

  canAddAnswer(questionIndex: number): boolean {
    const questionGroup = this.questionsFormArray.at(questionIndex) as FormGroup;
    const questionType = questionGroup.get('questionType')?.value;
    const answers = questionGroup.get('answers') as FormArray;

    if (questionType === 1) { 
      return answers.length < 2;
    }
    return answers.length < 6;
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.answersFormArray(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
    } else {
      this.errorMessage = "Une question doit avoir au moins deux options de réponse.";
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.authService.isLoggedIn) {
      this.errorMessage = "Erreur d'authentification. Veuillez vous reconnecter.";
      this.router.navigate(['/connexion']);
      return;
    }

    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      this.errorMessage = "Veuillez remplir correctement tous les champs obligatoires.";
      return;
    }

    const questionsValue = this.quizForm.value.questions;
    for (let i = 0; i < questionsValue.length; i++) {
      const question = questionsValue[i];
      const correctAnswersCount = question.answers.filter((ans: Answer) => ans.isCorrect).length;
      if (correctAnswersCount !== 1) {
        this.errorMessage = `La question ${i + 1} doit avoir exactement une bonne réponse.`;
        this.isLoading = false;
        return;
      }
    }

    this.isLoading = true;
    const formValue = this.quizForm.value;

    let numericDifficulty: number;
    switch (formValue.difficultyLevel) {
      case "Facile": numericDifficulty = 0; break;
      case "Moyen": numericDifficulty = 1; break;
      case "Difficile": numericDifficulty = 2; break;
      case "Expert": numericDifficulty = 3; break;
      default:
        this.errorMessage = "Niveau de difficulté sélectionné invalide.";
        this.isLoading = false;
        return;
    }

    const loggedInUser = this.authService.getLoggedInUser();

    if (!loggedInUser || typeof loggedInUser.userId === 'undefined') {
        this.errorMessage = "ID utilisateur non trouvé. Veuillez vous assurer que vous êtes correctement connecté.";
        this.isLoading = false;
        return;
    }

    const quizPayloadForBackend = {
      quizId: 0,
      title: formValue.title,
      description: formValue.description,
      categoryId: +formValue.categoryId,
      difficulty: numericDifficulty,
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
        this.successMessage = 'Quiz créé avec succès ! Redirection en cours...';
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
            this.errorMessage = `Erreur Serveur : ${err.error}`;
        } else if (err.error && err.error.message) {
          this.errorMessage = `Erreur Serveur : ${err.error.message}`;
        } else if (err.statusText && err.status) {
           this.errorMessage = `Erreur : ${err.status} - ${err.statusText}.`;
        } else {
          this.errorMessage = 'Une erreur inattendue s\'est produite lors de la création du quiz.';
        }
      }
    });
  }
}
