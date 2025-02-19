import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionTupasComponent } from './relacion-tupas.component';

describe('RelacionTuplasComponent', () => {
  let component: RelacionTupasComponent;
  let fixture: ComponentFixture<RelacionTupasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelacionTupasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionTupasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
