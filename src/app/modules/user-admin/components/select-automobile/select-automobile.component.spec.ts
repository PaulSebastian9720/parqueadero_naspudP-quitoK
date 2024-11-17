import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAutomobileComponent } from './select-automobile.component';

describe('SelectAutomobileComponent', () => {
  let component: SelectAutomobileComponent;
  let fixture: ComponentFixture<SelectAutomobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAutomobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAutomobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
