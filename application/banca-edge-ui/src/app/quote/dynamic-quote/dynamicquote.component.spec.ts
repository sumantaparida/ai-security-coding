import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicquoteComponent } from './dynamicquote.component';

describe('DynamicquoteComponent', () => {
  let component: DynamicquoteComponent;
  let fixture: ComponentFixture<DynamicquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
