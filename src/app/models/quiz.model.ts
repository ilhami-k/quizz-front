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
  category?: string;
  difficultyLevel?: string;
  totalQuestions?: number; 
  participantsCount?: number;
}