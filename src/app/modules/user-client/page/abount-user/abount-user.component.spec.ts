import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbountUserComponent } from './abount-user.component';

describe('AbountUserComponent', () => {
  let component: AbountUserComponent;
  let fixture: ComponentFixture<AbountUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbountUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
