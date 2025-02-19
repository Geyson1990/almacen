import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TupaAyudaComponent } from './tupa-ayuda.component';

describe('TupaAyudaComponent', () => {
  let component: TupaAyudaComponent;
  let fixture: ComponentFixture<TupaAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TupaAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TupaAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
