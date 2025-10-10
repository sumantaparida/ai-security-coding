import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoModelComponent } from './yes-no-model.component';

describe('YesNoModelComponent', () => {
  let component: YesNoModelComponent;
  let fixture: ComponentFixture<YesNoModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
