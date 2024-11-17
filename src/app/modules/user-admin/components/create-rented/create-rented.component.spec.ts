import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRentedComponent } from './create-rented.component';

describe('CreateRentedComponent', () => {
  let component: CreateRentedComponent;
  let fixture: ComponentFixture<CreateRentedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRentedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRentedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
