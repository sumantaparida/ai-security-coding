/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { ActivatedRoute, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyVaultService } from '@app/_services/policy-vault.service';
import { LmsService } from '../services/lms.service';
import { User } from '@app/_models';
import { ModalComponent } from './modal-comnponent/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { OtpModalComponent } from '@app/shared/components/otp-modal/otp-modal.component';
import { ViewDocModalComponent } from './view-doc-modal/viewDocModal.component';
import { DirectDebitModalComponent } from '../components/direct-debit-modal/direct-debit-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { NewModalComponent } from './new-modal-component/new-modal.component';
import moment from 'moment';

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

@Component({
  selector: 'app-lms',
  templateUrl: './lms.component.html',
  styleUrls: ['./lms.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LmsComponent implements OnInit {
  customerId: number;

  columnsToDisplay = [
    ' ',
    'Insurer Name',
    'Product Name',
    'Policy Number',
    'Customer Name',
    'Status',

    'Premium',
    'Actions',
  ];

  policyApplicationDetailsArr;

  policyApplicationArrCopy;

  policyApplicationSearchCopy;

  policyDetailString;

  searchForm: FormGroup;

  pageIndex = 0;

  pageSize = 10;

  pageSizeOptions: number[] = [10];

  inforceStatusCount = 0;

  pendingStatusCount = 0;

  inactiveStatusCount = 0;

  initiatedStatusCount = 0;

  displayedMobileColumns: string[] = ['Insurer Name', 'Actions'];

  isMobileView: boolean;

  paymentTerm;

  insuredDOB;

  insuredGender;

  insuredRel;

  isBranchUser = false;

  isInsurerUser;

  applicationDetails;

  downloadDocuments;

  expandedElement;

  hidden = false;

  leadId;

  minDate: Date;

  orgCode;

  screenOrientation;
  minutesLeft;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('fromInput', {
    read: MatInput,
  })
  fromInput: MatInput;

  @ViewChild('fromEndDate', {
    read: MatInput,
  })
  fromEndDate: MatInput;

  sortHeaderData: Sort;

  isLoading = false;

  filterStatus = [
    { value: 'LEAD', id: 1 },
    { value: 'LOGGED IN', id: 2 },
    { value: 'Rejected By Customer', id: 3 },
    { value: 'UW Pending', id: 4 },
    { value: 'DECLINED/POSTPONED', id: 6 },
    { value: 'ISSUED/INFORCE', id: 9 },
    { value: 'Follow Up', id: 11 },
    { value: 'Awaiting Documentation', id: 12 },
    // { value: 'Approved Digitally', id: 13 },
    // { value: 'Pending', id: 14 },
  ];

  lobForFilter = [];

  // isMobileView = false;
  innerWidth;

  displayedColumns: string[] = [];

  isRoutedFromCPage = false;

  hasLeadBatch;

  isSP;

  currentUser: User;

  insurersForFilter;

  policyStatusForFilter;

  productsForFilter;

  isAdminUser;

  availableBranches;

  totalRecords;

  planList;

  productTypeList = [];
  // Example Data

  // reqBody = {
  //   "pageNo": 2,
  //   "pageSize": 10,
  //   "searchData": "",
  //   "branch": 389,
  //   "product": "",
  //   "status": 0,
  //   "startDate": "",
  //   "endDate": ""
  // }

  // currentUser = JSON.parse(localStorage.getItem('user'));

  reqBody = {
    pageNo: this.pageIndex + 1,
    pageSize: this.pageSize,
    insurer: '',
    lob: '',
    searchData: '',
    branch: '',
    product: '',
    cisStatus: '',
    startDate: '',
    endDate: '',
    productType: '',
  };

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private policyVaultService: PolicyVaultService,
    private lmsService: LmsService,
    public media: MediaObserver,
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {
    this.route.params.subscribe((params) => {
      if (params.CID) {
        this.customerId = params.CID;
      } else {
        this.customerId = null;
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.accountService.userValue;
    this.isInsurerUser = this.currentUser?.insurerUser == 'true' ? true : false;
    // this.reqBody['branch'] = this.currentUser.branchCode
    if (this.isInsurerUser) {
      this.reqBody.insurer = this.currentUser.insurerId.toString();
    }
    console.log('user =', this.currentUser);
    this.isAdminUser = this.currentUser['userGroups'].includes('ADMIN') ? true : false;
    console.log('user =', this.currentUser, this.isAdminUser);
    this.lmsService.getOfflineInsurers().subscribe(
      (insurers) => {
        this.insurersForFilter = insurers;
      },
      (err) => {
        this.insurersForFilter = null;
      },
    );

    this.lmsService.getMasterCodesPolicyStatus().subscribe(
      (policyStatus) => {
        // this.loaderService.showSpinner(false);
        this.policyStatusForFilter = policyStatus;
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
    this.orgCode = this.currentUser?.organizationCode;
    if (this.orgCode === 'DCB') {
      this.columnsToDisplay.splice(6, 0, 'rps');
    } else {
      this.columnsToDisplay.splice(6, 0, 'branchName', 'lcd');
    }
    this.isBranchUser = this.accountService.isBranchUser;

    if (typeof this.currentUser.isSP == 'boolean') {
      this.isSP = this.currentUser.isSP;
      console.log('issp', this.isSP, this.isBranchUser);
    } else {
      this.isSP = this.currentUser.isSP == 'true' ? true : false;
      console.log('not booolean issp', this.isSP, this.isBranchUser);
    }
    if (this.orgCode === 'DCB') {
      if (!this.isSP && !this.isAdminUser) {
        const index = this.columnsToDisplay.indexOf('Actions');
        this.columnsToDisplay.splice(index, 1);
        const mobileIndex = this.displayedMobileColumns.indexOf('Actions');
        this.displayedMobileColumns.splice(mobileIndex, 1);
      }
    }

    this.innerWidth = window.innerWidth;
    // this.resetDisplayedColumnsXtraSmall();
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
      filterByInsurer: new FormControl(''),
      filterByBranch: new FormControl(''),
      filterByLob: new FormControl(''),
      filterByProductType: new FormControl(''),
      filterByProduct: new FormControl({ value: '', disabled: false }),
      filterByStatus: new FormControl(''),
      filterByDateStart: new FormControl(''),
      filterByDateEnd: new FormControl({ value: '' }),
    });
    // this.getPolicyApplicationDetails();
    // this.isLoading = true;
    this.loaderService.showSpinner(true);

    this.route.queryParams.subscribe((params) => {
      if (params.customerId) {
        this.isRoutedFromCPage = true;
      }
      this.customerId = params.customerId;
    });

    if (this.isRoutedFromCPage) {
      this.getPolicyDetailForCustomer();
    } else {
      this.getPolicyApplicationDetails();
    }

    // this.policyApplicationDetailsArr = policyDetails['leadMainDtos'];
    // this.totalRecords = policyDetails['totalRecords'];

    // this.formatData();

    this.searchForm.get('filterByInsurer').valueChanges.subscribe((event) => {
      console.log('event', event);
      this.reqBody['insurer'] = event;
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });

    this.searchForm.get('filterByLob').valueChanges.subscribe((event) => {
      this.reqBody['lob'] = event;
      let searchLob;
      // if (this.lobForFilter) {
      //   this.lobForFilter.forEach((plan) => {
      //     if (plan.lob === this.reqBody['lob']) {
      //       searchLob = plan.productType;
      //     }
      //   });
      // }

      // const searchInsurer = this.searchForm.get('filterByInsurer').value;

      // if (searchLob !== undefined && searchInsurer !== '') {
      // this.lmsService
      //   .getProductsByProductTypeInsurer(
      //     this.searchForm.get('filterByLob').value,
      //     searchLob,
      //     this.searchForm.get('filterByInsurer').value,
      //   )
      //   .subscribe((product) => {
      //     this.productsForFilter = product;
      //   });
      // }
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });

    this.searchForm.get('filterByProductType').valueChanges.subscribe((event) => {
      this.reqBody['productType'] = event;
      const searchInsurer = this.searchForm.get('filterByInsurer').value;
      let searchLob;
      if (this.lobForFilter) {
        this.lobForFilter.forEach((plan) => {
          if (plan.lob === this.reqBody['lob']) {
            searchLob = plan.productType;
          }
        });
        this.searchForm.get('filterByProduct').setValue('');
      }

      if (
        this.searchForm.get('filterByLob').value !== '' &&
        searchInsurer !== '' &&
        this.searchForm.get('filterByProductType').value
      ) {
        this.lmsService
          .getProductsByProductTypeInsurer(
            this.searchForm.get('filterByLob').value,
            this.searchForm.get('filterByProductType').value,
            this.searchForm.get('filterByInsurer').value,
          )
          .subscribe((product) => {
            this.productsForFilter = product;
          });
      }
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });

    this.searchForm.get('filterByBranch').valueChanges.subscribe((event) => {
      this.reqBody['searchData'] = event;
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });
    // this.searchForm.get('filterByLob').valueChanges.subscribe((event) => {

    //   this.policyApplicationDetailsArr.splice(0, this.policyApplicationDetailsArr.length);
    //   this.reqBody['lob'] = event.toLocaleLowerCase();
    //   this.lmsService.getLeadsForUser(this.reqBody).subscribe((values) => {
    //     this.totalRecords = values['totalRecords'];
    //     this.policyApplicationDetailsArr = values['leadMainDtos'];
    //     this.formatData()

    //   });
    // });

    this.searchForm.get('filterByProduct').valueChanges.subscribe((event) => {
      this.policyApplicationDetailsArr.splice(0, this.policyApplicationDetailsArr.length);
      this.reqBody['product'] = event?.toLocaleLowerCase();
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });

    this.searchForm.get('filterByStatus').valueChanges.subscribe((event) => {
      this.reqBody['cisStatus'] = event;
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });
    this.searchForm.get('filterByDateStart').valueChanges.subscribe((event) => {
      this.reqBody['startDate'] = event
        .toLocaleString('en-GB')
        .slice(0, 10)
        .split('/')
        .reverse()
        .join('-');

      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });
    this.searchForm.get('filterByDateEnd').valueChanges.subscribe((event) => {
      this.reqBody['endDate'] = event
        .toLocaleString('en-GB')
        .slice(0, 10)
        .split('/')
        .reverse()
        .join('-');
      this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['leadMainDtos'];
        this.formatData();
      });
    });

    this.searchForm
      .get('searchField')
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((event) => {
        this.reqBody['searchData'] = event.trim();
        this.reqBody.pageNo = 1;
        this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
          this.totalRecords = values['totalRecords'];
          this.policyApplicationDetailsArr = values['leadMainDtos'];
          this.formatData();
        });
      });
  }
  // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
  // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

  resetDate(val) {
    console.log('this', this.fromInput);
    // this.fromInput.value = '';
    val === 'start'
      ? ((this.reqBody['startDate'] = ''), (this.fromInput.value = ''))
      : ((this.reqBody['endDate'] = ''), (this.fromEndDate.value = ''));
    // val === 'start' ? this.fromInput.value = '' : this.fromEndDate.value = '';
    // this.policyVaultService.getApplicationForUser(this.reqBody).subscribe((values) => {
    //   this.totalRecords = values['totalRecords'];
    //   this.policyApplicationDetailsArr = values['customerApplicationDtos'];
    // });
    // this.searchForm.controls['filterByDateStart'].value.reset()
    this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
      this.totalRecords = values['totalRecords'];
      this.policyApplicationDetailsArr = values['leadMainDtos'];
      this.formatData();
    });
  }

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.screenOrientation = event.target.screen.orientation.type;
    if (this.screenOrientation === 'landscape-primary') {
      this.resetDisplayedColumnsXtraSmall();
    }
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820 && this.screenOrientation === 'portrait-primary') {
      if (this.orgCode === 'DCB') {
        this.displayedMobileColumns = ['Customer Name', 'Policy Number', 'Status', 'Actions'];
        this.displayedColumns = this.displayedMobileColumns;
      } else {
        this.displayedColumns = this.displayedMobileColumns;
      }
      this.isMobileView = true;
    } else if (this.innerWidth < 820 && this.screenOrientation === 'landscape-primary') {
      this.displayedColumns = this.columnsToDisplay;
    } else {
      this.displayedColumns = this.columnsToDisplay;
      this.isMobileView = false;
    }
  }

  callSearchAndPlans(event) {
    console.log('vent', event);
    if (event.value) {
      this.getOfflinePlans(event.value);
    }
    this.lmsService.getAllowedBankBranchesforInsurerUser(this.orgCode).subscribe((branch) => {
      this.availableBranches = branch;
    });
  }

  onBranchChange(event) {
    // this.onSearchFieldChange();
  }

  onlobChange(event) {
    // event.target.value;
    this.productTypeList = [];
    console.log(event.value, 'sss');
    this.planList.filter((plan) => {
      console.log(event.value, 'sss', plan.lob);

      plan.lob === event.value ? this.productTypeList.push(plan) : -1;
    });
  }

  getOfflinePlans(insurerId) {
    this.lmsService.getOfflinePlans(insurerId).subscribe((data) => {
      // this.loaderService.showSpinner(false);
      this.planList = data;
      this.planList.forEach((plan) => {
        if (!this.lobForFilter?.includes(plan.lob)) this.lobForFilter.push(plan.lob);
        // console.log('plan----',this.lobForFilter);
      });

      // this.onSearchFieldChange();
    });
  }

  // resetDisplayedColumnsXtraSmall() {
  //   if (this.innerWidth < 600) {
  //     this.displayedColumns = this.displayedMobileColumns;
  //     this.isMobileView = true;
  //   } else {
  //     this.displayedColumns = this.columnsToDisplay;
  //     this.isMobileView = false;
  //   }
  // }

  onToggle(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggle(expanded) {
    expanded = !expanded;
  }

  getPolicyDetailForCustomer() {
    this.policyVaultService.getCustomerPolicy(this.customerId).subscribe(
      (customerPolicy) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = customerPolicy;
        this.formatData();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.accountService.logout();
      },
    );
  }

  getPolicyApplicationDetails() {
    let newDate = new Date().getTime();

    this.loaderService.showSpinner(true);
    this.lmsService.getLeadsForUserNew(this.reqBody).subscribe(
      (policyDetails) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.totalRecords = policyDetails['totalRecords'];
        this.policyApplicationDetailsArr = policyDetails['leadMainDtos'];

        if (this.orgCode == 'DCB') {
          this.policyApplicationDetailsArr = this.policyApplicationDetailsArr.filter((policy) => {
            let date = new Date(policy.applicationDate).getTime();
            let diff = Math.floor((newDate - date) / (1000 * 3600 * 24));
            console.log(diff, '60 days');
            if (diff > 60) {
              if (policy.leadinsurerRefid) {
                return policy;
              }
            } else {
              return policy;
            }
          });
        }

        this.formatData();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.accountService.logout();
      },
    );
  }

  formatData() {
    this.policyApplicationDetailsArr?.forEach((policy) => {
      if (policy?.status === 'INFORCE') {
        this.inforceStatusCount++;
      } else if (policy?.status === 'PENDING') {
        this.pendingStatusCount++;
      } else if (policy?.status === 'INACTIVE') {
        this.inactiveStatusCount++;
      } else {
        this.initiatedStatusCount++;
      }
    });

    this.policyApplicationDetailsArr?.map((policyApplicationDetails) => {
      policyApplicationDetails['expanded'] = false;
      if (
        policyApplicationDetails.applicationData &&
        policyApplicationDetails.applicationData.insureds &&
        policyApplicationDetails.applicationData.insureds.dob
      ) {
        const dob = new Date(policyApplicationDetails.applicationData.insureds.dob);
        const timeDiff = new Date().getTime() - dob.getTime();
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        policyApplicationDetails.applicationData.insureds['age'] = age;
      }
      if (
        policyApplicationDetails.applicationData &&
        policyApplicationDetails.applicationData.additionalData
      ) {
        // console.log('kavita dob', policyApplicationDetails.applicationData.additionalData.insuredDob);
        this.insuredDOB = policyApplicationDetails.applicationData.additionalData.insuredDob;
        this.insuredGender = policyApplicationDetails.applicationData.additionalData.insuredGender;
        this.insuredRel = policyApplicationDetails.applicationData.additionalData.insuredRel;
      }
      const insuredArr = policyApplicationDetails.applicationData?.insureds;

      if (insuredArr && !Array.isArray(insuredArr)) {
        if (insuredArr['gender'] === 'F') {
          insuredArr['gender'] = 'Female';
        } else if (insuredArr['gender'] === 'M') {
          insuredArr['gender'] = 'Male';
        }
      } else if (insuredArr && Array.isArray(insuredArr)) {
        insuredArr.map((insuredPerson) => {
          const dob = new Date(insuredPerson.dob);
          const timeDiff = new Date().getTime() - dob.getTime();
          const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          insuredPerson['age'] = age;
          const relationShipCode = insuredPerson.proposerRel;
          const productid = policyApplicationDetails.productId;
          // this.policyVaultService.getRelationShip(productid, relationShipCode).subscribe(relation => {
          //   insuredPerson['relationValue'] = relation['value'];
          // });
        });
        policyApplicationDetails['healthInsuranceDetails'] = insuredArr;
      }
      // policyApplicationDetails['cDate'] = new Date(policyApplicationDetails.createdDate);
      if (policyApplicationDetails.insurerCode === 147 && policyApplicationDetails?.leadBatch) {
        const jsonData = JSON.parse(policyApplicationDetails?.leadBatch?.addInfo);
        policyApplicationDetails['etliStatus'] = this.etliSalesDispositionMaster(
          jsonData.SalesDispositionId,
        );
        //console.log(policyApplicationDetails['etliStatus']);
      }
    });
    this.policyApplicationSearchCopy = this.policyApplicationDetailsArr.slice();
    this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
  }

  etliSalesDispositionMaster(id) {
    // switch (id) {
    //   case 1:
    //     return 'New Lead';
    //   case 2:
    //     return 'Non-Contact';
    //   case 3:
    //     return 'Follow up';
    //   case 4:
    //     return 'Appointment';
    //   case 5:
    //     return 'Rejected';
    //   case 6:
    //     return 'Not Interested';
    //   case 7:
    //     return 'Met';
    //   case 8:
    //     return 'Not Met';
    //   case 9:
    //     return 'Converted';
    //   case 10:
    //     return 'Rejected';
    //   case 15:
    //     return 'Converted';
    //   case 17:
    //     return 'Calling Activity';
    //   case 18:
    //     return 'Allocation Activity';
    //   case 52:
    //     return 'Nudge Sharing Activity';
    //   case 54:
    //     return 'Schedule a call back';
    //   default:
    //     return '';
    // }
    switch (id) {
      case 1:
        return 'Initiated';
      case 2:
        return 'Rejected';
      case 3:
        return 'Follow up';
      case 4:
        return 'Follow Up';
      case 5:
        return 'Rejected';
      case 6:
        return 'Rejected';
      case 7:
        return 'Follow Up';
      case 8:
        return 'Follow Up';
      case 9:
        return '';
      case 10:
        return 'Declined';
      case 15:
        return 'Inforce';
      case 17:
        return 'Follow Up';
      case 18:
        return 'Initiated';
      case 52:
        return 'Follow Up';
      case 54:
        return 'Follow Up';
      default:
        return '';
    }
  }

  sortData(sort: Sort, isSearching?: boolean) {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    if (isSearching && sort !== undefined) {
      this.sortHeaderData = sort;
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      this.policyApplicationArrCopy = this.getSortedData();
    } else if (isSearching) {
      this.paginator.pageIndex = 0;
      this.pageIndex = 0;
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
    } else {
      this.sortHeaderData = sort;
      this.policyApplicationArrCopy = [];
      this.policyApplicationDetailsArr.slice();
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      this.policyApplicationArrCopy = this.getSortedData();
    }
  }

  getSortedData() {
    const data = this.policyApplicationSearchCopy.slice();
    if (
      this.sortHeaderData &&
      (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
    ) {
      this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
        this.pageIndex,
        this.pageSize,
      );
      return this.policyApplicationArrCopy;
    }
    this.policyApplicationSearchCopy = data.sort((a, b) => {
      const isAsc = this.sortHeaderData.direction === 'asc';
      switch (this.sortHeaderData.active) {
        case 'Insurer Name':
          return this.compare(a.insurerName, b.insurerName, isAsc);
        case 'Product Name':
          return this.compare(a.productName, b.productName, isAsc);
        case 'Policy Number':
          return this.compare(a.applicationNo, b.applicationNo, isAsc);
        case 'Customer Name':
          return this.compare(a.customerName, b.customerName, isAsc);
        case 'Status':
          return this.compare(a.status, b.status, isAsc);
        case 'Premium':
          return this.compare(a.premiumAmount, b.premiumAmount, isAsc);
        case 'Product Id':
          return this.compare(a.productId, b.productId, isAsc);
        default:
          return 0;
      }
    });

    return this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchFieldChange() {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    if (this.searchForm.get('filterByProduct').value !== '') {
      // const lob = this.searchForm.get('filterByProduct').value;
      // const insurerId = this.searchForm.get('filterByInsurer').value;
      // // const branchId = this.searchForm.get('filterByBranch').value;
      // const productType = this.lobForFilter.filter((plans) => {
      //   if (plans.productType === lob) {
      //     return plans.lob;
      //   }
      // });
      // this.getProductsByLob(lob, productType, insurerId);
    }
    // this.sortData(this.sortHeaderData, true);
    // this.policyApplicationArrCopy = [];
    // this.policyApplicationSearchCopy = [];
    // this.policyApplicationSearchCopy = this.getSearchResults();

    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
  }

  // getProductsByLob(lob, productType, insurerId) {
  //   this.lmsService.getProductsByProductTypeInsurer(lob, productType, insurerId).subscribe(
  //     (result) => {
  //       this.productsForFilter = result;
  //       this.loaderService.showSpinner(false);
  //     },
  //     (error) => {
  //       // this.productDropdown = [{ id: 'Test', value: 'Test' }];
  //       this.loaderService.showSpinner(false);
  //     },
  //   );
  // }

  onInitiatePayment(application) {
    console.log(application);
    this.router.navigate(['/', 'initiate-payment', application]);
  }

  // onPageChange(event: PageEvent) {
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  //   const policiesToDisplay = event.pageIndex * event.pageSize;
  //   this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
  //     policiesToDisplay,
  //     policiesToDisplay + event.pageSize,
  //   );
  // }

  onPageChange(event: PageEvent) {
    this.loaderService.showSpinner(true);
    this.pageSize = event.pageSize;
    this.reqBody['pageNo'] = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    // const policiesToDisplay = event.pageIndex * event.pageSize;
    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
    //   policiesToDisplay,
    //   policiesToDisplay + event.pageSize,
    // );
    this.lmsService.getLeadsForUserNew(this.reqBody).subscribe(
      (policyDetails) => {
        this.loaderService.showSpinner(false);
        // this.isLoading = false;
        // this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = policyDetails['leadMainDtos'];
        this.totalRecords = policyDetails['totalRecords'];

        this.formatData();
      },
      () => {
        // this.loaderService.showSpinner(false);
        this.accountService.logout();
      },
    );
  }

  moreThan15Minutes(insuredLeadPushTime) {
    const milliSecDiff = moment(moment(Date.now()), 'minutes').diff(insuredLeadPushTime);
    const minutesDiff = moment.duration(milliSecDiff);
    console.log(minutesDiff['_data'].minutes);
    this.minutesLeft = minutesDiff['_data'].minutes;
    return minutesDiff['_data'].minutes > 15;
  }

  consentFlowSendLeadDataToInsurer(applicationData, appNo) {
    // insuredLeadPushCount
    const timeElapsed = this.moreThan15Minutes(applicationData?.insuredLeadPushTime);
    if (!timeElapsed) {
      const minDiff = 15 - this.minutesLeft;
      const dialogref = this.dialog.open(PolicyErrorModalComponent, {
        data: `Please try after ${minDiff} minutes`,
        panelClass: 'dialog-width',
      });
    }

    if (applicationData.insuredLeadPushCount < 2 && timeElapsed) {
      this.sendLeadToInsurer(appNo);
    }
  }

  sendOtp(applicationData, productName, bankCustomerId, mobileNo, appNo, online, orgCode, email) {
    console.log('online=', online);
    if (this.orgCode === 'DCB') {
      this.consentFlowSendLeadDataToInsurer(applicationData, appNo);

      // if (!online) {
      //   this.sendLeadToInsurer(appNo);
      // } else if (online) {
      //   const otpDcbData = {
      //     otpKey: bankCustomerId,
      //     otpRequestDesc: '',
      //     mobileNo: mobileNo,
      //   };
      //   this.lmsService.sendDcbOtp(otpDcbData).subscribe(
      //     (res) => {
      //       this.loaderService.showSpinner(false);
      //       console.log(res);
      //       if (res['responseStatus'] == 0) {
      //         this.validateOtp(productName, bankCustomerId, mobileNo, appNo);
      //       }
      //     },
      //     (err) => {
      //       this.loaderService.showSpinner(false);
      //     },
      //   );
      // }
    } else {
      // this.loaderService.showSpinner(true);
      this.sendLeadToInsurer(appNo);
      // const payload = {
      //   otpKey: appNo,
      //   mobileNo: mobileNo,
      //   otpRequestDesc: '',
      //   email: email,
      // };
      // this.loaderService.showSpinner(true);
      // this.lmsService.sendOtp(payload).subscribe(
      //   (response) => {
      //     this.loaderService.showSpinner(false);
      //     if (response['statusCode'] == 0) {
      //       this.validateOtp(productName, bankCustomerId, mobileNo, appNo);
      //     }
      //   },
      //   (err) => {
      //     this.loaderService.showSpinner(false);
      //   },
      // );
    }
  }

  validateOtp(productName, bankCustomerId, mobileNo, appNo) {
    let isDcb = false;
    if (this.orgCode === 'DCB') {
      isDcb = true;
    }
    let dialogRef = this.dialog.open(OtpModalComponent, {
      data: {
        appNo: appNo.toString(),
        dcb: isDcb,
        cifNumber: bankCustomerId,
        productName: productName,
        mobileNo: mobileNo,
      },
      panelClass: 'dialog-width',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loaderService.showSpinner(true);
      if (result === true) {
        this.sendLeadToInsurer(appNo);
        // this.loaderService.showSpinner(false);
      } else {
        this.loaderService.showSpinner(false);
      }
    });
  }

  sendLeadToInsurer(appNo) {
    this.loaderService.showSpinner(true);
    this.lmsService.sendLeadDataToInsurer(appNo.toString()).subscribe(
      (sentResult) => {
        this.loaderService.showSpinner(false);

        let newdialog = this.dialog.open(ModalComponent, {
          data: sentResult,
          panelClass: 'dialog-width',
        });
        newdialog.afterClosed().subscribe((result) => {
          if (sentResult['statusCode'] === 1) {
            this.getPolicyApplicationDetails();
          }
        });
      },
      (err) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  resendCustomerConsent(leadNumber) {
    this.loaderService.showSpinner(true);

    this.lmsService.resendCustomerConsent(leadNumber).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);

        console.log('respond', res);
        let newdialog = this.dialog.open(PolicyErrorModalComponent, {
          data: res['details'][0],
          panelClass: 'dialog-width',
        });
        // let newdialog = this.dialog.open(ModalComponent, {
        //   data: res,
        //   panelClass: 'dialog-width',
        // });
        newdialog.afterClosed().subscribe((result) => {});
      },
      (err) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  checkPolicyStatus(appNo, insurerCode) {
    this.loaderService.showSpinner(true);
    this.lmsService.checkPolicyStatus(appNo, insurerCode).subscribe(
      (status) => {
        this.loaderService.showSpinner(false);
        console.log(status);
        let newdialog = this.dialog.open(ModalComponent, {
          data: status,
          panelClass: 'dialog-width',
        });
        newdialog.afterClosed().subscribe((result) => {});
      },
      (err) => {
        const dataErr = {
          message: 'Server is down, please try after sometime',
        };
        this.loaderService.showSpinner(false);
        let newdialog = this.dialog.open(ModalComponent, {
          data: err.message ? err : dataErr,
          panelClass: 'dialog-width',
        });
        newdialog.afterClosed().subscribe((result) => {});
      },
    );
  }

  checkLeadStatus(appNo) {
    this.loaderService.showSpinner(true);
    this.lmsService.checkLeadStatus(appNo).subscribe(
      (leadStatus) => {
        this.loaderService.showSpinner(false);
        let newdialog = this.dialog.open(ModalComponent, {
          data: leadStatus,
          panelClass: 'dialog-width',
        });
        newdialog.afterClosed().subscribe((result) => {});
      },
      (err) => {
        this.loaderService.showSpinner(false);
        const dataErr = {
          message: 'Application not found',
        };
        let newdialog = this.dialog.open(ModalComponent, {
          data: err.message ? err : dataErr,
          panelClass: 'dialog-width',
        });
        newdialog.afterClosed().subscribe((result) => {});
      },
    );
  }

  checkLeadStatusCondition(insurerCode, leadBatch, refId, leadStatus) {
    // element?.insurerCode === 101 && !element?.leadBatch && element?.leadinsurerRefid -- html code
    if (insurerCode === 101) {
      if (!leadBatch && refId) {
        return true;
      }
    } else if (insurerCode === 105 && this.orgCode !== 'CSB') {
      if (leadStatus === 'LEAD') {
        return true;
      }
    }
  }

  openDocuments(leadId, riskProfileStatus) {
    // this.router.navigate()
    let height;
    if (riskProfileStatus === 'Rejected') {
      height = '150px';
    } else {
      height = '350px';
    }

    let newdialog = this.dialog.open(ViewDocModalComponent, {
      width: '600px',
      height: height,
      data: { leadId: leadId, riskProfileStatus: riskProfileStatus },
      panelClass: 'dialog-width',
    });
    newdialog.afterClosed().subscribe(() => {
      this.getPolicyApplicationDetails();
    });
  }

  uploadDocument(leadNumber) {
    let newdialog = this.dialog.open(ViewDocModalComponent, {
      width: '600px',
      height: '400px',
      data: { leadId: leadNumber, isUpload: true },
      panelClass: 'dialog-width',
    });
    newdialog.afterClosed().subscribe(() => {
      this.getPolicyApplicationDetails();
    });
  }

  // getSearchResults() {
  //   const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
  //   const searchResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
  //     const policyDetailString = JSON.stringify(policyDetail);
  //     if (
  //       policyDetailString.match(searchValue) ||
  //       policyDetailString.toLocaleLowerCase().match(searchValue)
  //     ) {
  //       return policyDetail;
  //     }
  //   });
  //   return searchResults;
  // }

  getSearchResults() {
    // const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    // const searchResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
    //   const policyDetailString = JSON.stringify(policyDetail);
    //   if (
    //     policyDetailString.match(searchValue) ||
    //     policyDetailString.toLocaleLowerCase().match(searchValue)
    //   ) {
    //     return policyDetail;
    //   }
    // });
    // return searchResults;

    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    const searchInsurer = this.searchForm.get('filterByInsurer').value;
    const searchBranch = this.searchForm.get('filterByBranch').value;
    const searchProduct = this.searchForm.get('filterByProduct').value;
    let searchLob;
    // if (this.lobForFilter) {
    //   this.lobForFilter.forEach((plan) => {
    //     if (plan.lob === this.searchForm.get('filterByLob')?.value) {
    //       search = plan.lob;
    //     }
    //   });
    // }

    if (
      this.searchForm.get('filterByProductType').value !== '' &&
      searchInsurer !== '' &&
      this.searchForm.get('filterByLob').value
    ) {
      this.searchForm.controls.filterByProduct.enable();
      this.lmsService
        .getProductsByProductTypeInsurer(
          this.searchForm.get('filterByLob').value,
          this.searchForm.get('filterByProductType').value,
          searchInsurer,
        )
        .subscribe((product) => {
          this.productsForFilter = product;
        });
    }
    console.log('const searchLob', searchLob);
    // const searchBranch = this.searchForm.get('filterByBranch').value.toLocaleLowerCase();

    const searchStatus = this.searchForm.get('filterByStatus').value;
    console.log('search status =', searchStatus);
    const searchStartDate = this.searchForm.get('filterByDateStart').value;
    console.log('vale==', searchStartDate, '');
    const searchEndDate =
      searchStartDate === '' ? '' : this.searchForm.get('filterByDateEnd').value;
    console.log('aaaaaaaaaaaaa', this.policyApplicationDetailsArr);
    if (searchStartDate === null) {
      this.searchForm.get('filterByDateEnd').setValue('');
      this.searchForm.controls.filterByDateEnd.disable();
    } else {
      this.minDate = new Date(searchStartDate);
      this.searchForm.controls.filterByDateEnd.disable();
    }

    const filterObj = {
      insurerCode: searchInsurer,
      branchCode: '',
      productId: searchProduct,
      lob: searchLob,
      statusCode: searchStatus !== '' ? +searchStatus : '',
    };
    // const filterResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
    //   for (const key in filterObj) {
    //     if (filterObj[key] !== '') {
    //       if (policyDetail[key] === undefined) {
    //         return false;
    //       }
    //     }
    //   }
    //   return true;
    // });
    const filterResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
      for (const key in filterObj) {
        if (filterObj[key] !== '' && filterObj[key] !== undefined) {
          console.log(filterObj[key], policyDetail[key]);
          if (policyDetail[key] === undefined || policyDetail[key] != filterObj[key]) {
            return false;
          }
        }
      }
      return true;
    });
    const searchResults = this.getSearchAfterFilter(filterResults, searchValue);
    const dateResults = this.getDateFilter(searchResults, searchStartDate, searchEndDate);
    return dateResults;
  }

  getSearchAfterFilter(filterResults, searchValue) {
    console.log('filter results', filterResults);

    const searchResults = filterResults.filter((policyDetail) => {
      const policyDetailString = JSON.stringify(policyDetail);
      if (
        policyDetailString.match(searchValue) ||
        policyDetailString.toLocaleLowerCase().match(searchValue)
      ) {
        return policyDetail;
      }
    });
    return searchResults;
  }

  getDateFilter(searchResults, searchStartDate, searchEndDate) {
    console.log(searchResults, searchStartDate, searchEndDate);
    const dateResults = searchResults.filter((policyDetail) => {
      const policyCreationDate = new Date(`${policyDetail.applicationDate} GMT+0530`);
      const startDate = new Date(searchStartDate);
      const endDate = new Date(searchEndDate);
      if (searchStartDate !== '' && searchEndDate === '') {
        if (policyCreationDate.getTime() >= startDate.getTime()) {
          console.log('insinde  if ');

          return policyDetail;
        }
      } else if (searchStartDate !== '' && searchEndDate !== '') {
        if (
          policyCreationDate.getTime() >= startDate.getTime() &&
          policyCreationDate.getTime() <= endDate.getTime()
        ) {
          console.log('insinde else if else');

          return policyDetail;
        }
      } else {
        console.log('insinde else');
        return policyDetail;
      }
    });
    return dateResults;
  }

  onCreateNewService(appno) {
    this.router.navigate(['/myrequest/register-service-request'], { queryParams: { appno } });
  }

  onCreateNewComplaint(complaintNo) {
    this.router.navigate(['/mycomplaints/register-complaint'], { queryParams: { complaintNo } });
  }

  // showOrHide(column) {
  //   return this.displayedMobileColumns.indexOf(column) === -1;
  // }
  downloadProposalForm(applicationNumber, documentType) {
    console.log('policy Number', applicationNumber);
    this.applicationDetails = {
      applicationNo: applicationNumber,
      // applicationNo: '12750546319',
      documentType: documentType,
    };
    this.policyVaultService.downloadProposalForm(this.applicationDetails).subscribe(
      (download) => {
        if (download['documents'] !== null) {
          this.downloadDocuments = download['documents'];
          console.log('application details', this.downloadDocuments[0]?.documentUrl, download);
          // this.downloadPdf(this.downloadDocuments[0]?.documentUrl, this.downloadDocuments[0]?.applicationNo)
          window.open(this.downloadDocuments[0]?.documentUrl, '_blank');
        }
      },
      (error) => {
        console.log('error downloading');
      },
    );
  }

  initiateDirectDebit(customerData) {
    console.log('enter direct debit details');
    // let customerName = firstName + ' ' + lastName;
    let dbDialog = this.dialog.open(DirectDebitModalComponent, {
      data: customerData,
    });
  }

  goToApplication(customerId, appNo) {
    this.router.navigate([`/lms/new-application/${appNo}`]);
  }

  base64Pdf(data) {
    const byte64Data = data;
    const byteArray = new Uint8Array(
      atob(byte64Data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    console.log('url-->', url);
    window.open(url, '_blank');
  }

  downloadCidf(appNo) {
    this.loaderService.showSpinner(true);
    this.policyVaultService.getCidfForLead(appNo).subscribe(
      (res) => {
        if (res['reportUrl']) {
          this.loaderService.showSpinner(false);
          window.open(res['reportUrl'], '_blank');
        } else if (res['resultData']) {
          this.base64Pdf(res['resultData']);
          this.loaderService.showSpinner(false);
        } else {
          this.loaderService.showSpinner(false);
          this.dialog.open(PolicyErrorModalComponent, {
            data: 'Unable to download PDF, Please try after sometime.',
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.dialog.open(PolicyErrorModalComponent, {
          data: 'Unable to download PDF, Please try after sometime.',
          panelClass: 'dialog-width',
        });
      },
    );
  }

  downloadPolicyPdf(leadId) {
    this.loaderService.showSpinner(true);
    this.lmsService.getPolicyPdfFromInsurer(leadId).subscribe(
      (pdf) => {
        if (pdf['responseCode'] == 0) {
          this.loaderService.showSpinner(false);

          this.base64Pdf(pdf['pdfData']);
        } else {
          this.loaderService.showSpinner(false);
          this.dialog.open(PolicyErrorModalComponent, {
            data: 'Unable to download PDF, Please try after sometime.',
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);

        this.dialog.open(PolicyErrorModalComponent, {
          data: 'Unable to download PDF, Please try after sometime.',
          panelClass: 'dialog-width',
        });
      },
    );
  }

  pushPayment(appNo) {
    this.loaderService.showSpinner(true);
    this.lmsService.sendLmsPaymentDetailsToInsurer(appNo).subscribe((res) => {
      this.loaderService.showSpinner(false);

      const dialogref = this.dialog.open(PolicyErrorModalComponent, {
        data: res['responseMessage'],
        panelClass: 'dialog-width',
      });
      dialogref.afterClosed().subscribe(() => {
        if (res['responseCode'] == 0) {
          this.getPolicyApplicationDetails();
          this.router.navigateByUrl('/lms');
        }
      });
    });
  }

  omitSpecialChar(event) {
    let k;
    k = event.charCode;
    console.log(k);
    //         k = event.keyCode;  (Both can be used)
    return (
      (k > 63 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      k == 46 ||
      k == 45 ||
      k == 95 ||
      (k >= 48 && k <= 57)
    );
  }

  sendToInsurerOption(
    leadinsurerRefid,
    online,
    documentUploaded,
    statusCode,
    appData,
    insurerActive
  ) {
   
    if (statusCode == 24 || statusCode == 16) {
      return false;
    } else if (this.isBranchUser && !leadinsurerRefid && this.isSP) {
      if (this.orgCode == 'DCB') {
        if (online) {
          return appData?.consentSubmittedTime ? true : false;
        } else {
          return documentUploaded ? true : false;
        }
      } else if (this.orgCode == 'CSB' && statusCode == 26) {
        
        return true;
      }
    } else return false;
  }

  uploadAndSendToInsurer(
    leadNumber,
    productName,
    bankCustomerId,
    mobile,
    id,
    online,
    orgCode,
    email,
  ) {
    let newdialog = this.dialog.open(ViewDocModalComponent, {
      width: '600px',
      height: '400px',
      data: { leadId: leadNumber, isUpload: true, sendToInsurer: true },
      panelClass: 'dialog-width',
    });
    newdialog.afterClosed().subscribe((res) => {
      if (res) {
        let dialog = this.dialog.open(NewModalComponent, {
          panelClass: 'dialog-width',
        });
        dialog.afterClosed().subscribe(() => {
          this.sendLeadToInsurer(id);
        });
      }

      // this.sendOtp(productName, bankCustomerId, mobile, id, online, orgCode, email);
    });
  }

  goToUrl(url) {
    console.log(url);
    window.open(url, '__blank');
  }
}
