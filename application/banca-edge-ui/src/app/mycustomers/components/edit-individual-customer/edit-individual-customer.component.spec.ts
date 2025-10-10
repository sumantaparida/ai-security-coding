import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndividualCustomerComponent } from './edit-individual-customer.component';
import { AccountService } from '../../../_services/account.service';
import { User } from '../../../_models/user';

import { Observable, of } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';

const USER_OBJECT: User = {
  firstName: 'James',
  lastName: 'James',
  organizationCode: 'SB',
  branchCode: '10',
  email: 'xyz@abc.com',
  roles: ['ZONE.CUSTOMER.CREATE', 'BRANCH.CUSTOMER.CREATE'],
  sp: true,
  allowedBranches: []
};

class MockAccountService {
  public get userValue(): User {
    return USER_OBJECT;
  }
}

describe('EditIndividualCustomerComponent', () => {
  let component: EditIndividualCustomerComponent;
  let fixture: ComponentFixture<EditIndividualCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [EditIndividualCustomerComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockAccountService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIndividualCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
