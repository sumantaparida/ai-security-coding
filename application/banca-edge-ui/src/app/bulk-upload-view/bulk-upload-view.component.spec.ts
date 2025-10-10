import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadViewComponent } from './bulk-upload-view.component';

describe('BulkUploadViewComponent', () => {
  let component: BulkUploadViewComponent;
  let fixture: ComponentFixture<BulkUploadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
