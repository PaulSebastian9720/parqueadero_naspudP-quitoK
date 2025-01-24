import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaggeMailComponent } from './mesagge-mail.component';

describe('MesaggeMailComponent', () => {
  let component: MesaggeMailComponent;
  let fixture: ComponentFixture<MesaggeMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesaggeMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesaggeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
