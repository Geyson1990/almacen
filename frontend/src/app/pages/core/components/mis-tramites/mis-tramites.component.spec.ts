import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisTramitesComponent } from './mis-tramites.component';

describe('MisTramitesComponent', () => {
  let component: MisTramitesComponent;
  let fixture: ComponentFixture<MisTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
