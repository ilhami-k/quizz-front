export interface UserAnswer{
    questionId: number;
    answerId: number;
}

export interface QuizSubmission {
    quizId: number;
    answers: UserAnswer[];
}