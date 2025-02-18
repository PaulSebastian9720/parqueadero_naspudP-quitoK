import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDealBaseComponent } from './show-deal-base.component';

describe('ShowDealBaseComponent', () => {
  let component: ShowDealBaseComponent;
  let fixture: ComponentFixture<ShowDealBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDealBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDealBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
