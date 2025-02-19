import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionEtapaContruccionComponent } from './descripcion-etapa-contruccion.component';

describe('DescripcionEtapaContruccionComponent', () => {
  let component: DescripcionEtapaContruccionComponent;
  let fixture: ComponentFixture<DescripcionEtapaContruccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionEtapaContruccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescripcionEtapaContruccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
