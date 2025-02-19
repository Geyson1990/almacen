import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidadorVoucherComponent } from './validador-voucher.component';


describe('ValidadorVoucherComponent', () => {
  let component: ValidadorVoucherComponent;
  let fixture: ComponentFixture<ValidadorVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidadorVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidadorVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
