import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAutomovileComponent } from './form-automovile.component';

describe('FormAutomovileComponent', () => {
  let component: FormAutomovileComponent;
  let fixture: ComponentFixture<FormAutomovileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAutomovileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAutomovileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
