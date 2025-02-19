import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFileUploadComponent } from './basic-file-upload.component';

describe('BasicFileUploadComponent', () => {
  let component: BasicFileUploadComponent;
  let fixture: ComponentFixture<BasicFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
