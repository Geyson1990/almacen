import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatesTableComponent } from './coordinates-table.component';

describe('CoordinatesTableComponent', () => {
  let component: CoordinatesTableComponent;
  let fixture: ComponentFixture<CoordinatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoordinatesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
