import { Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';
import { ClassementComponent } from './classement/classement.component';
import { ResultatComponent } from './resultat/resultat.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'quiz/:id', component: QuizDetailsComponent }, 
    { path: 'classement', component: ClassementComponent },
    { path: 'resultat', component: ResultatComponent },
    { path: 'connexion', component: ConnexionComponent }
];