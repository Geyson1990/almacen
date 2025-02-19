import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaManualComponent } from './ayuda-manual.component';

describe('AyudaManualComponent', () => {
  let component: AyudaManualComponent;
  let fixture: ComponentFixture<AyudaManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
