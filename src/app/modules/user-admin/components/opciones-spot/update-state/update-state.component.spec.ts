import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStateComponent } from './update-state.component';

describe('UpdateStateComponent', () => {
  let component: UpdateStateComponent;
  let fixture: ComponentFixture<UpdateStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
