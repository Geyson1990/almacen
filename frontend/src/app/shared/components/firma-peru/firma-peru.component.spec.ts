import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaPeruComponent } from './firma-peru.component';

describe('FirmaPeruComponent', () => {
  let component: FirmaPeruComponent;
  let fixture: ComponentFixture<FirmaPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmaPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
