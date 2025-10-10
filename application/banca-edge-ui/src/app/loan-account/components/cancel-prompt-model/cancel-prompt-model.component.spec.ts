import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPromptModelComponent } from './cancel-prompt-model.component';

describe('CancelPromptModelComponent', () => {
  let component: CancelPromptModelComponent;
  let fixture: ComponentFixture<CancelPromptModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelPromptModelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelPromptModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
