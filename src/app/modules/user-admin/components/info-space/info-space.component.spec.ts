import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSpaceComponent } from './info-space.component';

describe('InfoSpaceComponent', () => {
  let component: InfoSpaceComponent;
  let fixture: ComponentFixture<InfoSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
