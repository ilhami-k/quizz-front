export interface QuizQuestion {
  questionId: number;
  questionText: string;
  questionType: number;
  answers: Answer[]
}
export interface Quiz {
  quizId: number;
  title: string;
  description?: string;
  questions?: QuizQuestion[];
  category?: Category;
  creatorUsername?: string;
  dificulty?: number;
  totalQuestions?: number; 
  participantsCount?: number;
}
export interface Category {
  categoryId: number;
  name: string;
  createdAt ?: string;
}
export interface Answer {
  answerId?: number;
  answerText: string;
  isCorrect: boolean;
}