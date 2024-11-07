import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixSpacesComponent } from './matrix-spaces.component';

describe('MatrixSpacesComponent', () => {
  let component: MatrixSpacesComponent;
  let fixture: ComponentFixture<MatrixSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixSpacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
