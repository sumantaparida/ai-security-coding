import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyVaultComponent } from './policyvault.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('PolicyvaultComponent', () => {
  let component: PolicyVaultComponent;
  let fixture: ComponentFixture<PolicyVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyVaultComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ CID: 1 }]),
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
