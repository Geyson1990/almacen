import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPdfComponent } from './vista-pdf.component';

describe('VistaPdfComponent', () => {
  let component: VistaPdfComponent;
  let fixture: ComponentFixture<VistaPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
