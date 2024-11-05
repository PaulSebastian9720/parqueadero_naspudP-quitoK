import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehiculesComponent } from './view-vehicules.component';

describe('ViewVehiculesComponent', () => {
  let component: ViewVehiculesComponent;
  let fixture: ComponentFixture<ViewVehiculesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVehiculesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVehiculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
