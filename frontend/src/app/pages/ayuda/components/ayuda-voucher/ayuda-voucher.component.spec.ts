import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaVoucherComponent } from './ayuda-voucher.component';

describe('AyudaVoucherComponent', () => {
  let component: AyudaVoucherComponent;
  let fixture: ComponentFixture<AyudaVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
