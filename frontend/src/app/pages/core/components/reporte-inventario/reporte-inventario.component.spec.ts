import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisInventariosComponent } from './mis-inventarios.component';

describe('MisInventariosComponent', () => {
  let component: MisInventariosComponent;
  let fixture: ComponentFixture<MisInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisInventariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
