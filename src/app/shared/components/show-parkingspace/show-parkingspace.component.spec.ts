import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowParkingspaceComponent } from './show-parkingspace.component';

describe('ShowParkingspaceComponent', () => {
  let component: ShowParkingspaceComponent;
  let fixture: ComponentFixture<ShowParkingspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowParkingspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowParkingspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
