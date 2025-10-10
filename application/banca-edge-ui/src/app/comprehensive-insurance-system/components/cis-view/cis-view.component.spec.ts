import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CisViewComponent } from './cis-view.component';

describe('CisViewComponent', () => {
  let component: CisViewComponent;
  let fixture: ComponentFixture<CisViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CisViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
