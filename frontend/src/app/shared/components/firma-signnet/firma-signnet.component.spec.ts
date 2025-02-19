import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaSignnetComponent } from './firma-signnet.component';

describe('FirmaSignnetComponent', () => {
  let component: FirmaSignnetComponent;
  let fixture: ComponentFixture<FirmaSignnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmaSignnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaSignnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
