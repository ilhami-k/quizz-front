import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnConstructionComponent } from './en-construction.component';

describe('EnConstructionComponent', () => {
  let component: EnConstructionComponent;
  let fixture: ComponentFixture<EnConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnConstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
