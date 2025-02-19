import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadCoreComponent } from './file-upload-core.component';

describe('FileUploadCoreComponent', () => {
  let component: FileUploadCoreComponent;
  let fixture: ComponentFixture<FileUploadCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
