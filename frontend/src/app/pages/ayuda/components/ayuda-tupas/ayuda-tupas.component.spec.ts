import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaTupasComponent } from './ayuda-tupas.component';

describe('AyudaTupasComponent', () => {
  let component: AyudaTupasComponent;
  let fixture: ComponentFixture<AyudaTupasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaTupasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaTupasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
