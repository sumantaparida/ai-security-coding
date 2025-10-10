// import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { FormService } from '../services/form-service.service';
import { UserManagementService } from '../services/user-managent.service';
import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
// import { FormControl, FormGroup } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyVaultService } from '@app/_services/policy-vault.service';
import { User } from '@app/models/user.model';
import { PaymentApprovalService } from '@app/payment-approval/services/payment-approval.service';
// import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
// import { UserManagementService } from '@app/user-management/services/user-managent.service';
// import { UserManagementService } from '@app/user-management/services/user-managent.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { connect } from 'http2';
// import { YesNoModelComponent } from '../yes-no-model/yes-no-model.component';
import { YesNoModelComponent } from '../components/yes-no-model/yes-no-model.component';
import { error } from 'console';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UpdateLeadStatusDialog } from '../dialog/update-lead-status.dialog';

@Component({
  selector: 'app-view-master',
  templateUrl: './view-master.component.html',
  styleUrls: ['./view-master.component.css'],
})
export class ViewMasterComponent implements OnInit {
  customerId: number;

  policyApplicationDetailsArr;

  policyApplicationArrCopy;

  policyApplicationSearchCopy;

  policyDetailString;

  searchForm: FormGroup;

  pageIndex = 0;

  pageSize = 10;

  // pageSizeOptions: number[] = [5, 10, 25, 100];

  pageSizeOptions: number[] = [10];

  inforceStatusCount = 0;

  pendingStatusCount = 0;

  inactiveStatusCount = 0;

  initiatedStatusCount = 0;

  displayedMobileColumns: string[] = ['Status', 'Customer Name', 'Actions'];

  isMobileView: boolean;

  paymentTerm;

  insuredDOB;

  insuredGender;

  insuredRel;

  isBranchUser = false;

  isInsurer = false;

  applicationDetails;

  downloadDocuments;

  expandedElement;

  hidden = false;

  coverMaster;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('fromInput', {
    read: MatInput,
  })
  fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput,
  })
  toInput: MatInput;

  sortHeaderData: Sort;

  isLoading = false;

  // isMobileView = false;
  innerWidth;

  displayedColumns: string[] = [];

  columnsToDisplay = [
    'productName',
    'productId',
    'createdBy',
    'coverName',
    'coverId',
    'lastModifiedBy',
    'Actions',
  ];

  isRoutedFromCPage = false;

  currentUser: User;

  productsForFilter;

  minDate: Date;

  policyStatusForFilter;

  policyStatus;

  branchesForFilter;

  masterType = 'Covers';

  totalRecords;

  org;

  userGroups;

  isAdmin = false;

  isUamUser = false;
  selectedMaster = '';

  constructor(
    public userManService: UserManagementService,
    private route: ActivatedRoute,
    private policyVaultService: PolicyVaultService,
    public media: MediaObserver,
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private paymentService: PaymentApprovalService,
    private dialog: MatDialog,
  ) {
    this.route.params.subscribe((params) => {
      if (params.CID) {
        this.customerId = params.CID;
      } else {
        this.customerId = null;
      }
    });
  }

  // reqBody = { organizationCode: '', branchCode: '', searchData: '', pageSize: 10, pageNo: 1 };
  reqBody = { masterType: 'Covers', searchData: '', pageSize: 10, pageNo: 1 };

  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      if (user) {
        this.org = user['organizationCode'];
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.selectedMaster = queryParams.id;
      this.reqBody['masterType'] = this.selectedMaster;
    });
    this.loaderService.showSpinner(true);
    // this.reqBody.organizationCode = this.org;
    this.getApplicationDetails();
    this.currentUser = this.accountService.userValue;
    this.isBranchUser = this.accountService.isBranchUser;
    this.isInsurer = this.accountService.isInsurer;
    this.innerWidth = window.innerWidth;
    if (this.currentUser.organizationCode === 'KB') {
      this.columnsToDisplay.splice(7, 0, 'Insurer Status');
    }
    // this.resetDisplayedColumnsXtraSmall();
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
      filterByBranch: new FormControl(''),
      filterByProduct: new FormControl(''),
      filterByStatus: new FormControl(''),
      filterByDateStart: new FormControl(),
      filterByDateEnd: new FormControl(),
      mastertName: new FormControl(),
    });

    this.searchForm
      .get('searchField')
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((event) => {
        this.reqBody['searchData'] = event.trim();
        this.reqBody.pageNo = 1;
        this.userManService.getUsersList(this.reqBody).subscribe((values) => {
          this.totalRecords = values['totalRecords'];
          this.policyApplicationDetailsArr = values['coverDtoList'];
        });
      });

    this.searchForm.get('filterByBranch').valueChanges.subscribe((event) => {
      this.reqBody['branchCode'] = event;
      this.loaderService.showSpinner(true);
      this.userManService.getUsersList(this.reqBody).subscribe((values) => {
        this.loaderService.showSpinner(false);
        this.totalRecords = values['totalRecords'];
        this.policyApplicationDetailsArr = values['coverDtoList'];
      });
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
    this.userManService.getAllBranches().subscribe(
      (branches) => {
        this.branchesForFilter = branches;
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  // onSearchFieldChange() {}

  onMasterChange(event) {
    this.loaderService.showSpinner(true);
    this.reqBody['masterType'] = event?.value;
    this.masterType = event.value;
    this.setColumns();
    this.reqBody.pageNo = 1;
    this.reqBody.pageSize = this.pageSize;
    this.userManService.getPaginatedMaster(this.reqBody).subscribe(
      (values) => {
        this.paginator.firstPage();
        this.loaderService.showSpinner(false);

        this.loaderService.showSpinner(false);
        this.totalRecords = values['totalRecords'];
        if (event.value === 'Covers') {
          this.policyApplicationDetailsArr = values['coverDtoList'];
        } else if (event.value === 'Medical_Question') {
          this.policyApplicationDetailsArr = values['medicalQuestionDtoList'];
        } else if (event.value === 'Lov_Code') {
          this.policyApplicationDetailsArr = values['lovCodeDtoList'];
        } else if (event.value === 'Branch') {
          this.policyApplicationDetailsArr = values['branchDtoList'];
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onAddUser() {
    const message = 'addUser';
    const dialogRef = this.dialog.open(YesNoModelComponent, {
      data: { userName: 'Sunjith', KBL: true },
    });
    dialogRef.afterClosed().subscribe((data) => {});
  }

  onAddMaster() {
    this.router.navigate(['user-management/add-master']);
  }

  navigateTo(id) {
    console.log(id);
    this.router.navigate([`user-management/add-master/${this.masterType}/${id}`]);
  }

  enableDisableUser(type, username) {
    this.loaderService.showSpinner(true);

    const requestType = {
      status: type,
      userName: username,
    };

    this.userManService.enableDisableUser(requestType).subscribe((data) => {
      this.loaderService.showSpinner(false);
      this.dialog.open(PolicyErrorModalComponent, {
        data: data?.responseMessage,
        panelClass: 'dialog-width',
      });
      this.getApplicationDetails();
      // this.userSearchForm.get('searchField').setValue('');
      // this.getUsers();
    });
  }

  // resetStartDate() {
  //   this.fromInput.value = '';
  //   this.reqBody['startDate'] = '';
  //   this.policyVaultService.getApplicationForUser(this.reqBody).subscribe((values) => {
  //     this.totalRecords = values['totalRecords'];
  //     this.policyApplicationDetailsArr = values['customerApplicationDtos'];
  //   });
  //   // this.searchForm.controls['filterByDateStart'].value.reset()
  // }

  // resetEndDate() {
  //   this.toInput.value = '';
  //   this.reqBody['endDate'] = '';
  //   this.policyVaultService.getApplicationForUser(this.reqBody).subscribe((values) => {
  //     this.totalRecords = values['totalRecords'];
  //     this.policyApplicationDetailsArr = values['customerApplicationDtos'];
  //   });
  //   // this.searchForm.controls['filterByDateEnd'].value.reset()
  // }

  getApplicationDetails() {
    // console.log('Application', this.reqBody)

    this.userManService.getDropdownForMaster('DocumentTemplates', 'UAM').subscribe((covers) => {
      this.coverMaster = covers;
    });

    this.loaderService.showSpinner(true);
    this.reqBody['masterType'] = this.selectedMaster;

    this.userManService.getPaginatedMaster(this.reqBody).subscribe((values) => {
      this.loaderService.showSpinner(false);

      this.totalRecords = values['totalRecords'];
      this.policyApplicationDetailsArr = values['coverDtoList'];
      this.policyApplicationDetailsArr.forEach((item) => {
        // item?.userGroups.forEach(value => {
        //   if(value == "ADMIN"){
        //     this.isAdmin = true
        //   }
        //   else if(value == "UAM_USER"){
        //     this.isUamUser = true
        //   }
        // })
      });
    });
  }
  // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
  // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.displayedColumns = this.displayedMobileColumns;
      this.isMobileView = true;
    } else {
      this.displayedColumns = this.columnsToDisplay;
      this.isMobileView = false;
    }
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

  // toggle(expanded) {
  //   // expanded = !expanded;
  // }

  formatData() {
    this.policyApplicationDetailsArr.forEach((policy) => {
      if (policy.status === 'INFORCE') {
        this.inforceStatusCount++;
      } else if (policy.status === 'PENDING') {
        this.pendingStatusCount++;
      } else if (policy.status === 'INACTIVE') {
        this.inactiveStatusCount++;
      } else {
        this.initiatedStatusCount++;
      }
    });

    this.policyApplicationDetailsArr.map((policyApplicationDetails) => {
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
          // const relationShipCode = insuredPerson.proposerRel;
          // const productid = policyApplicationDetails.productId;
          // this.policyVaultService.getRelationShip(productid, relationShipCode).subscribe(relation => {
          //   insuredPerson['relationValue'] = relation['value'];
          // });
        });
        policyApplicationDetails['healthInsuranceDetails'] = insuredArr;
      }
      // policyApplicationDetails['cDate'] = new Date(policyApplicationDetails.createdDate);
    });
    this.policyApplicationSearchCopy = this.policyApplicationDetailsArr.slice();
    this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
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
    this.sortData(this.sortHeaderData, true);
    this.policyApplicationArrCopy = [];
    this.policyApplicationSearchCopy = [];
    this.policyApplicationSearchCopy = this.getSearchResults();

    this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
  }

  onInitiatePayment(application) {
    console.log(application);
    this.router.navigate(['/', 'initiate-payment', application]);
  }

  issuePolicy(applicationNo, insurerId) {
    this.loaderService.showSpinner(true);
    this.paymentService.issuePolicy(applicationNo).subscribe(
      (policyData) => {
        this.loaderService.showSpinner(false);
        if (policyData['responseCode'] === 0) {
          this.paymentService.checkIssuanceResponse(applicationNo).subscribe(
            (res) => {
              console.log('check issuance policy', res);
              if (res.responseCode === 0) {
                let message =
                  +insurerId === 117 || +insurerId === 130
                    ? 'We have received your proposal for insurance, on successful evaluation and underwriting of proposal, we will issue /reject policy and same will be communicated with you.'
                    : 'Your Policy has been issued Successfully.You will receive your Policy Schedule shortly.';
                this.loaderService.showSpinner(false);
                this.router.navigate(['/Confirmation', insurerId, applicationNo], {
                  queryParams: {
                    status: 'Success',
                    paymentReferenceNo: policyData['paymentReferenceNo'],
                    policyNo: policyData['policyNo'],
                    premiumPaid: policyData['premiumPaid'],
                    logoUrl: policyData['logoUrl'],
                    appNo: applicationNo,
                    receiptNo: policyData['recieptNo'],
                    paymentGatewayId: policyData['paymentGatewayId'],
                    message: message,
                  },
                });
              } else {
                this.loaderService.showSpinner(false);
                this.router.navigate(['/Confirmation', insurerId, applicationNo], {
                  queryParams: {
                    status: 'Error',
                    paymentReferenceNo: policyData['paymentReferenceNo'],
                    policyNo: policyData['policyNo'],
                    premiumPaid: policyData['premiumPaid'],
                    logoUrl: policyData['logoUrl'],
                    appNo: applicationNo,
                    receiptNo: policyData['recieptNo'],
                    paymentGatewayId: policyData['paymentGatewayId'],
                    message: policyData['responseMessage'],
                  },
                });
              }
            },
            () => {
              console.log('issue policy failed');
              this.loaderService.showSpinner(false);
              this.router.navigate(['/Confirmation', insurerId, applicationNo], {
                queryParams: {
                  status: 'Error',
                  appNo: applicationNo,
                  message:
                    "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                },
              });
            },
          );
        } else {
          this.router.navigate(['/Confirmation', insurerId, applicationNo], {
            queryParams: {
              status: 'Error',
              paymentReferenceNo: policyData['paymentReferenceNo'],
              policyNo: policyData['policyNo'],
              premiumPaid: policyData['premiumPaid'],
              logoUrl: policyData['logoUrl'],
              appNo: applicationNo,
              receiptNo: policyData['recieptNo'],
              paymentGatewayId: policyData['paymentGatewayId'],
              message: policyData['responseMessage'],
            },
          });
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to issuePolicy, please try later.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  onPageChange(event: PageEvent) {
    this.loaderService.showSpinner(true);
    // this.pageSize = event.pageSize;
    this.reqBody['pageNo'] = event.pageIndex + 1;
    this.userManService.getPaginatedMaster(this.reqBody).subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        this.totalRecords = values['totalRecords'];
        if (this.reqBody.masterType === 'Covers') {
          this.policyApplicationDetailsArr = values['coverDtoList'];
        } else if (this.reqBody.masterType === 'Medical_Question') {
          this.policyApplicationDetailsArr = values['medicalQuestionDtoList'];
        } else if (this.reqBody.masterType === 'Lov_Code') {
          this.policyApplicationDetailsArr = values['lovCodeDtoList'];
        } else if (this.reqBody.masterType === 'Branch') {
          this.policyApplicationDetailsArr = values['branchDtoList'];
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
    // const policiesToDisplay = event.pageIndex * event.pageSize;
    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
    //   policiesToDisplay,
    //   policiesToDisplay + event.pageSize,
    // );
  }

  sendLeadToInsurer(appNo, insurerId) {
    this.loaderService.showSpinner(true);
    this.policyVaultService.sendLeadToInsurer(appNo).subscribe(
      (policyData) => {
        this.loaderService.showSpinner(false);
        console.log('policydata', policyData);
        if (policyData['isExternalNavigation']) {
          const mapForm = document.createElement('form');
          mapForm.method = policyData['method'];
          mapForm.action = policyData['url'];
          const queryStrings = policyData['url'].split('?');
          if (queryStrings.length > 1) {
            queryStrings.forEach((queryPairs) => {
              const queryPair = queryPairs.split('&');
              queryPair.forEach((pairs) => {
                const pair = pairs.split('=');
                const mapInput = document.createElement('input');
                mapInput.type = 'hidden';
                mapInput.name = pair[0];
                mapInput.value = pair[1];
                mapForm.appendChild(mapInput);
              });
            });
          }
          mapForm.style.display = 'none';
          mapForm.target = '_blank';
          if (policyData['payload'] && Object.keys(policyData['payload']).length > 0) {
            Object.keys(policyData['payload']).forEach((key) => {
              const mapInput = document.createElement('input');
              mapInput.type = 'hidden';
              mapInput.name = key;
              mapInput.value = policyData['payload'][key];
              mapForm.appendChild(mapInput);
            });
          }
          document.body.appendChild(mapForm);
          mapForm.submit();
        } else {
          this.loaderService.showSpinner(false);
          this.router.navigate(['/Confirmation', insurerId, policyData['applicationNo']], {
            queryParams: {
              status: policyData['status'],
              paymentReferenceNo: policyData['paymentReferenceNo'],
              policyNo: policyData['policyNo'],
              premiumPaid: policyData['premiumPaid'],
              logoUrl: policyData['logoUrl'],
              appNo: policyData['applicationNo'],
              receiptNo: policyData['recieptNo'],
              paymentGatewayId: policyData['paymentGatewayId'],
              message: policyData['message'],
            },
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to send to Insurer, please try later.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  onKeyUp(value) {
    this.policyApplicationDetailsArr.filter = value.trim().toLocaleLowerCase();
  }

  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
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

    // const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    const searchProduct = this.searchForm.get('filterByProduct').value.toLocaleLowerCase();
    const searchBranch = this.searchForm.get('filterByBranch').value.toLocaleLowerCase();

    const searchStatus = this.searchForm.get('filterByStatus').value.toLocaleLowerCase();
    console.log('search status =', searchStatus);
    const searchStartDate = this.searchForm.get('filterByDateStart').value;
    console.log(this.searchForm);
    const searchEndDate =
      searchStartDate === '' ? '' : this.searchForm.get('filterByDateEnd').value;

    if (searchStartDate === null) {
      this.searchForm.get('filterByDateEnd').setValue('');
      this.searchForm.controls.filterByDateEnd.disable();
    } else {
      this.minDate = new Date(searchStartDate);
      this.searchForm.controls.filterByDateEnd.enable();
    }

    const filterObj = {
      branchCode: searchBranch,
      productId: searchProduct,
      statusCode: searchStatus !== '' ? +searchStatus : '',
    };
    // const filterResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
    //   for (const key in filterObj) {
    //     if (filterObj[key] !== '') {
    //       if (
    //         policyDetail[key] === undefined ||
    //         policyDetail[key].toLocaleLowerCase() !== filterObj[key].toLocaleLowerCase()
    //       ) {
    //         return false;
    //       }
    //     }
    //   }
    //   return true;
    // });

    const filterResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
      for (const key in filterObj) {
        if (filterObj[key] !== '') {
          if (typeof filterObj[key] === 'string') {
            if (
              policyDetail[key] === undefined ||
              policyDetail[key].toLocaleLowerCase() !== filterObj[key].toLocaleLowerCase()
            ) {
              return false;
            }
          } else {
            if (policyDetail[key] === undefined || policyDetail[key] !== filterObj[key]) {
              return false;
            }
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
      if (searchStartDate !== null && searchEndDate === '') {
        if (policyCreationDate.getTime() >= startDate.getTime()) {
          return policyDetail;
        }
      } else if (searchStartDate !== null && searchEndDate !== '') {
        if (
          policyCreationDate.getTime() >= startDate.getTime() &&
          policyCreationDate.getTime() <= endDate.getTime()
        ) {
          return policyDetail;
        }
      } else {
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

  base64Pdf(data) {
    const byte64Data = data;
    const byteArray = new Uint8Array(
      atob(byte64Data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    // Here is your URL you can use
    const url = window.URL.createObjectURL(blob);
    console.log('url-->', url);
    window.open(url, '_blank');
  }

  downloadProposalForm(applicationNumber, documentType) {
    this.loaderService.showSpinner(true);
    this.applicationDetails = {
      templateKey: documentType === 'COI' ? 'AVIVA_COI_TEMPLATE' : 'AVIVA_PROPOSAL_TEMPLATE',
      templateName: documentType === 'COI' ? 'file_1687156903435.html' : 'file_1687157009729.html',
      applicationNo: applicationNumber,
      // applicationNo: '12750546319',
      documentType: documentType,
    };
    this.policyVaultService.downloadProposalForm(this.applicationDetails).subscribe(
      (download) => {
        if (download['resultData']) {
          this.base64Pdf(download['resultData']);
          this.loaderService.showSpinner(false);
        } else {
          this.loaderService.showSpinner(false);
          this.dialog.open(PolicyErrorModalComponent, {
            data: 'No records found',
            panelClass: 'dialog-width',
          });
        }
        // if (download['responseCode'] === 0) {
        //   if (download['documents'] !== null) {
        //     this.downloadDocuments = download['documents'];
        //     console.log('application details', this.downloadDocuments[0]?.documentUrl, download);
        //     // this.downloadPdf(this.downloadDocuments[0]?.documentUrl, this.downloadDocuments[0]?.applicationNo)
        //     this.loaderService.showSpinner(false);

        //     window.open(this.downloadDocuments[0]?.documentUrl, '_blank');
        //   }
        // } else if (download['responseCode'] !== 0) {
        //   this.loaderService.showSpinner(false);
        //   const message = download['responseMessage'];
        //   this.dialog.open(PolicyErrorModalComponent, {
        //     data: message,
        //     panelClass: 'dialog-width',
        //   });
        // }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error.responseMessage;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });

        console.log('error downloading');
      },
    );
  }

  downloadURLDoc(url) {
    window.open(url, '_blank');
  }

  declinePolicy(data, actionType: string) {
    this.loaderService.showSpinner(true);
    if (actionType === 'Reject') {
      data.statusCode = 16;
    } else if (actionType === 'Customer Not Interested') {
      data.statusCode = 12;
    }
  }

  checkPolicyStatus(policyNo) {
    this.loaderService.showSpinner(true);
    console.log('policy numner', policyNo);
    this.policyVaultService.checkPolicyStatus(policyNo).subscribe(
      (policy) => {
        this.loaderService.showSpinner(false);
        console.log(policy, '<-policy');
        const message =
          `Policy Status of application ${policyNo} is` +
          ' ' +
          policy['applicationData'].insurerPolicyStatus;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        // this.policyStatus = policy['applicationData']['insurerPolicyStatus'];
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to Check Policy status.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  base64ToPdf(applicationNo, insurerId) {
    this.loaderService.showSpinner(true);
    this.policyVaultService.getFnaBase64(applicationNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        const byte64Data = data['base64Pdf'];
        const url = data['base64Pdf'];
        if (insurerId === 103) {
          window.open(url, '_blank');
        } else {
          const byteArray = new Uint8Array(
            atob(byte64Data)
              .split('')
              .map((char) => char.charCodeAt(0)),
          );
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          // Here is your URL you can use
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error.responseMessage;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  sendCustomerConsent(appNo) {
    this.loaderService.showSpinner(true);
    this.policyVaultService.sendCustomerConsent(appNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        const message = 'Consent Link is sent to Customer';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error.responseMessage;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  rejectPolicy() {}

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

  deleteMaster(element) {}

  disableMaster(element) {}

  setColumns() {
    if (this.masterType === 'covers') {
      this.columnsToDisplay = [
        'productName',
        'productId',
        'createdBy',
        'coverName',
        'coverId',
        'lastModifiedBy',
        'Actions',
      ];
    } else if (this.masterType === 'Medical_Question') {
      this.columnsToDisplay = [
        'questionType',
        'productId',
        'questionId',
        'lastModifiedDate',
        'Actions',
      ];
    } else if (this.masterType === 'Lov_Code') {
      this.columnsToDisplay = [
        'lovId',
        'productId',
        'masterName',
        'value',
        'lastModifiedDate',
        'Actions',
      ];
    } else if (this.masterType === 'Branch') {
      this.columnsToDisplay = [
        'branchName',
        'branchCode',
        'cluster',
        'organizationCode',
        'createdDate',
        'Actions',
      ];
    }
  }
}
