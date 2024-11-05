import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSpaceComponent } from './rent-space.component';

describe('RentSpaceComponent', () => {
  let component: RentSpaceComponent;
  let fixture: ComponentFixture<RentSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
