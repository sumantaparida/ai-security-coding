import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbNeedAnalysisComponent } from './dcb-need-analysis.component';

describe('DcbNeedAnalysisComponent', () => {
  let component: DcbNeedAnalysisComponent;
  let fixture: ComponentFixture<DcbNeedAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbNeedAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbNeedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
