import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllDealComponent } from './list-all-deal.component';

describe('ListAllDealComponent', () => {
  let component: ListAllDealComponent;
  let fixture: ComponentFixture<ListAllDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllDealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
