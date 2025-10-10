import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteMemberSelectionComponent } from './quote-member-selection.component';

describe('QuoteMemberSelectionComponent', () => {
  let component: QuoteMemberSelectionComponent;
  let fixture: ComponentFixture<QuoteMemberSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteMemberSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteMemberSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
