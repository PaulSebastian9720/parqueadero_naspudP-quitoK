import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRateComponent } from './edit-rate.component';

describe('EditRateComponent', () => {
  let component: EditRateComponent;
  let fixture: ComponentFixture<EditRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
