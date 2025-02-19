import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaModalComponent } from './ayuda-modal.component';

describe('AyudaModalComponent', () => {
  let component: AyudaModalComponent;
  let fixture: ComponentFixture<AyudaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
