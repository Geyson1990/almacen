import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteIniciadoComponent } from './tramite-iniciado.component';

describe('TramiteIniciadoComponent', () => {
  let component: TramiteIniciadoComponent;
  let fixture: ComponentFixture<TramiteIniciadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramiteIniciadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramiteIniciadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
