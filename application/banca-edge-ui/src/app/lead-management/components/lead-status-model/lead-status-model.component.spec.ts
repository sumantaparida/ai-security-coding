import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { LeadStatusModelComponent } from './lead-status-model.component';

xdescribe('LeadStatusModelComponent', () => {
  let component: LeadStatusModelComponent;
  let fixture: ComponentFixture<LeadStatusModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadStatusModelComponent],
      imports: [MatDialogRef],
      providers: [MatDialogRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStatusModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



});
