import { Component } from '@angular/core';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
  selector: 'app-home',
  imports: [CategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
