import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbAdfsComponent } from './dcb-adfs.component';

describe('DcbAdfsComponent', () => {
  let component: DcbAdfsComponent;
  let fixture: ComponentFixture<DcbAdfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbAdfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbAdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
