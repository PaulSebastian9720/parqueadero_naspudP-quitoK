import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteMailComponent } from './write-mail.component';

describe('WriteMailComponent', () => {
  let component: WriteMailComponent;
  let fixture: ComponentFixture<WriteMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
