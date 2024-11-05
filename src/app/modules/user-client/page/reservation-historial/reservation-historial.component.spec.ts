import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationHistorialComponent } from './reservation-historial.component';

describe('ReservationHistorialComponent', () => {
  let component: ReservationHistorialComponent;
  let fixture: ComponentFixture<ReservationHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
