import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadModalComponent } from './create-lead-modal.component';

describe('CreateLeadModalComponent', () => {
  let component: CreateLeadModalComponent;
  let fixture: ComponentFixture<CreateLeadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLeadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
