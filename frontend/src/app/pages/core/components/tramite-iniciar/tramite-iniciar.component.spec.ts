import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteIniciarComponent } from './tramite-iniciar.component';

describe('TramiteIniciarComponent', () => {
  let component: TramiteIniciarComponent;
  let fixture: ComponentFixture<TramiteIniciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramiteIniciarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramiteIniciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
