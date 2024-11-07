import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceInventoryComponent } from './space-inventory.component';

describe('SpaceInventoryComponent', () => {
  let component: SpaceInventoryComponent;
  let fixture: ComponentFixture<SpaceInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
