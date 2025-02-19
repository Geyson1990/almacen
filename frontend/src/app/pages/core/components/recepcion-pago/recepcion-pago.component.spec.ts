import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionPagoComponent } from './recepcion-pago.component';

describe('RecepcionPagoComponent', () => {
  let component: RecepcionPagoComponent;
  let fixture: ComponentFixture<RecepcionPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecepcionPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
