import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMailComponent } from './admin-mail.component';

describe('AdminMailComponent', () => {
  let component: AdminMailComponent;
  let fixture: ComponentFixture<AdminMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
