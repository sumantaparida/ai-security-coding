import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailLifeComponent } from './more-detail-life.component';

describe('MoreDetailLifeComponent', () => {
  let component: MoreDetailLifeComponent;
  let fixture: ComponentFixture<MoreDetailLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
