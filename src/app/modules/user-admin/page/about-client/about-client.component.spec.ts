import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutClientComponent } from './about-client.component';

describe('AboutClientComponent', () => {
  let component: AboutClientComponent;
  let fixture: ComponentFixture<AboutClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
