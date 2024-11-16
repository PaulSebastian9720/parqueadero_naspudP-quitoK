import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRateComponent } from './select-rate.component';

describe('SelectRateComponent', () => {
  let component: SelectRateComponent;
  let fixture: ComponentFixture<SelectRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
