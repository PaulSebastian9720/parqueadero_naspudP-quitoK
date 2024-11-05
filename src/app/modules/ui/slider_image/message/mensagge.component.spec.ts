import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensaggeComponent } from './mensagge.component';

describe('MensaggeComponent', () => {
  let component: MensaggeComponent;
  let fixture: ComponentFixture<MensaggeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensaggeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensaggeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
