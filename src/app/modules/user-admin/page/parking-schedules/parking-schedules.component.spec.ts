import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSchedulesComponent } from './parking-schedules.component';

describe('ParkingSchedulesComponent', () => {
  let component: ParkingSchedulesComponent;
  let fixture: ComponentFixture<ParkingSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
