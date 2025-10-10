import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MintoproCkycModalComponent } from './mintopro-ckyc-modal.component';

describe('MintoproCkycModalComponent', () => {
  let component: MintoproCkycModalComponent;
  let fixture: ComponentFixture<MintoproCkycModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MintoproCkycModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MintoproCkycModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
