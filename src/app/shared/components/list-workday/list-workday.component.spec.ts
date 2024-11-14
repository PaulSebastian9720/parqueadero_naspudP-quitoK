import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkdayComponent } from './list-workday.component';

describe('ListWorkdayComponent', () => {
  let component: ListWorkdayComponent;
  let fixture: ComponentFixture<ListWorkdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWorkdayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWorkdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
