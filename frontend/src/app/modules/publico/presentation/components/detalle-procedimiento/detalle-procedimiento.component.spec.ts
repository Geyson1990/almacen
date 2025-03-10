import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProcedimientoComponent } from './detalle-procedimiento.component';

describe('DetalleProcedimientoComponent', () => {
  let component: DetalleProcedimientoComponent;
  let fixture: ComponentFixture<DetalleProcedimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleProcedimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProcedimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
