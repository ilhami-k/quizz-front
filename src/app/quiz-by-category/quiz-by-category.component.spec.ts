import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizByCategoryComponent } from './quiz-by-category.component';

describe('QuizByCategoryComponent', () => {
  let component: QuizByCategoryComponent;
  let fixture: ComponentFixture<QuizByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
