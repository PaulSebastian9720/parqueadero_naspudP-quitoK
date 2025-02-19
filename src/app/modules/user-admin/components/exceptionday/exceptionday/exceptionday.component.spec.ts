import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptiondayComponent } from './exceptionday.component';

describe('ExceptiondayComponent', () => {
  let component: ExceptiondayComponent;
  let fixture: ComponentFixture<ExceptiondayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceptiondayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptiondayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
