import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotCalenderComponent } from './spot-calender.component';

describe('SpotCalenderComponent', () => {
  let component: SpotCalenderComponent;
  let fixture: ComponentFixture<SpotCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
