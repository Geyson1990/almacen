import { TestBed } from '@angular/core/testing';
import { Formulario00617Service } from './formulario006-17.service';


describe('Formulario00617Service', () => {
  let service: Formulario00617Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00617Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
