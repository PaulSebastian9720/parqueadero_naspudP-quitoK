import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAutomobileComponent } from './list-automobile.component';

describe('ListAutomobileComponent', () => {
  let component: ListAutomobileComponent;
  let fixture: ComponentFixture<ListAutomobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAutomobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAutomobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
