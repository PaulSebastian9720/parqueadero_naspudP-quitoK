import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayParkingComponent } from './pay-parking.component';

describe('PayParkingComponent', () => {
  let component: PayParkingComponent;
  let fixture: ComponentFixture<PayParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayParkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
