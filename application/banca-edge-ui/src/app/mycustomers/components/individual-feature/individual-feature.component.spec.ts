import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualFeatureComponent } from './individual-feature.component';
import { AccountService } from '../../../_services/account.service';
import { User } from '../../../_models/user';
import { Observable, of } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

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
describe('IndividualFeatureComponent', () => {
  let component: IndividualFeatureComponent;
  let fixture: ComponentFixture<IndividualFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [IndividualFeatureComponent],
      providers: [
        { provide: AccountService, useClass: MockAccountService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
