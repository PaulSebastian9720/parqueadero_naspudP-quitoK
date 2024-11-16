import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRatesComponent } from './list-rates.component';

describe('ListRatesComponent', () => {
  let component: ListRatesComponent;
  let fixture: ComponentFixture<ListRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
