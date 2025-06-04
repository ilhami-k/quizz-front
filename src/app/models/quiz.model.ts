export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string; 
}
export interface Quiz {
  quizId: number;
  title: string;
  description?: string;
  questions?: QuizQuestion[];
  category?: Category;
  creator?: Creator;
  difficultyLevel?: string;
  totalQuestions?: number; 
  participantsCount?: number;
}
export interface Category {
  categoryId: number;
  name: string;
  createdAt ?: string;
}
export interface Creator {
  userId: number;
  username: string;
}