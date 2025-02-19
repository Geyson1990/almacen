import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentModalTableComponent } from './comment-modal-table.component';

describe('CommentModalTableComponent', () => {
  let component: CommentModalTableComponent;
  let fixture: ComponentFixture<CommentModalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentModalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentModalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
