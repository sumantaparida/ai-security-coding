import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UwAddNoteModelComponent } from './uw-add-note-model.component';

describe('UwAddNoteModelComponent', () => {
  let component: UwAddNoteModelComponent;
  let fixture: ComponentFixture<UwAddNoteModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UwAddNoteModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UwAddNoteModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
