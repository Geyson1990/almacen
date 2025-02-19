import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001AbcdntComponent } from './anexo001-abcdnt.component';

describe('Anexo001AbcdntComponent', () => {
  let component: Anexo001AbcdntComponent;
  let fixture: ComponentFixture<Anexo001AbcdntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001AbcdntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001AbcdntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
