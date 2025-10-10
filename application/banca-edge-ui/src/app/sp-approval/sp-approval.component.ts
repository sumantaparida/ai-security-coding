import { Component, OnInit, ViewChild, HostListener, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { PolicyVaultService } from '@app/_services/policy-vault.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoaderService } from '@app/_services/loader.service';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { SpApprovalService } from './service/sp-approval.service';



export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

@Component({
  selector: 'app-sp-approval',
  templateUrl: './sp-approval.component.html',
  styleUrls: ['./sp-approval.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SpApprovalComponent implements OnInit, AfterContentInit {

  customerId: number;
  columnsToDisplay = [' ', 'Insurer Name', 'Product Name', 'Policy Number', 'Customer Name', 'Status', 'Premium', 'Actions'];
  policyApplicationDetailsArr;
  policyApplicationArrCopy;
  policyApplicationSearchCopy;
  policyDetailString;
  searchForm: FormGroup;
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  inforceStatusCount = 0;
  pendingStatusCount = 0;
  inactiveStatusCount = 0;
  initiatedStatusCount = 0;
  displayedMobileColumns: string[] = [
    ' ', 'Customer Name', 'Actions'
  ];
  isMobileView: boolean;
  paymentTerm;
  insuredDOB;
  insuredGender;
  insuredRel;


  expandedElement;
  hidden = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sortHeaderData: Sort;
  isLoading = false;
  // isMobileView = false;
  innerWidth;
  displayedColumns: string[] = [];

  isRoutedFromCPage = false;
  currentUser: User;


  constructor(
    private route: ActivatedRoute,
    private policyVaultService: PolicyVaultService,
    private spApprovalService: SpApprovalService,
    public media: MediaObserver,
    private breakPointObserver: BreakpointObserver, private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService

  ) {
    this.route.params.subscribe(params => {
      if (params.CID) {
        this.customerId = params.CID;
      }
      else {
        this.customerId = null;
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.accountService.userValue;
    this.innerWidth = window.innerWidth;
    // this.resetDisplayedColumnsXtraSmall();
    this.searchForm = new FormGroup({
      searchField: new FormControl('')
    });
    // this.getPolicyApplicationDetails();
    // this.isLoading = true;
    this.loaderService.showSpinner(true);


    this.route.queryParams.subscribe(params => {

      if (params.customerId) {
        this.isRoutedFromCPage = true;
      }
      this.customerId = params.customerId;
    }

    );

    this.getPolicyApplicationDetails();
  }
  // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
  // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

  ngAfterContentInit() {

    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }


  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.displayedColumns = this.displayedMobileColumns;
      this.isMobileView = true;
    }
    else {
      this.displayedColumns = this.columnsToDisplay;
      this.isMobileView = false;


    }
  }

  onToggle(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggle(expanded) {
    expanded = !expanded;
  }

  getPolicyApplicationDetails() {
    this.spApprovalService.getPolicyApplicationForUser().subscribe(policyDetails => {
      // this.isLoading = false;
      this.loaderService.showSpinner(false);
      this.policyApplicationDetailsArr = policyDetails;
      // this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
      // console.log('insured ', this.policyApplicationDetailsArr);
      this.formatData();
    }, error => {
      this.loaderService.showSpinner(false);
      this.accountService.logout();

    });
  }

  formatData() {
    this.policyApplicationDetailsArr.forEach(policy => {
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

    this.policyApplicationDetailsArr.map(policyApplicationDetails => {
      policyApplicationDetails['expanded'] = false;
      if (policyApplicationDetails.applicationData && policyApplicationDetails.applicationData.insureds &&
        policyApplicationDetails.applicationData.insureds.dob) {
        const dob = new Date(policyApplicationDetails.applicationData.insureds.dob);
        const timeDiff = new Date().getTime() - dob.getTime();
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        policyApplicationDetails.applicationData.insureds['age'] = age;

      }
      if (policyApplicationDetails.applicationData
        && policyApplicationDetails.applicationData.additionalData) {
        // console.log('kavita dob', policyApplicationDetails.applicationData.additionalData.insuredDob);
        this.insuredDOB = policyApplicationDetails.applicationData.additionalData.insuredDob;
        this.insuredGender = policyApplicationDetails.applicationData.additionalData.insuredGender;
        this.insuredRel = policyApplicationDetails.applicationData.additionalData.insuredRel;
      }
      const insuredArr = policyApplicationDetails.applicationData.insureds;

      if (insuredArr && !Array.isArray(insuredArr)) {
        if (insuredArr['gender'] === 'F') {
          insuredArr['gender'] = 'Female';
        } else if (insuredArr['gender'] === 'M') {
          insuredArr['gender'] = 'Male';
        }

      } else if (insuredArr && Array.isArray(insuredArr)) {
        insuredArr.map(insuredPerson => {
          const dob = new Date(insuredPerson.dob);
          const timeDiff = new Date().getTime() - dob.getTime();
          const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
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
    if (this.sortHeaderData && (!this.sortHeaderData.active || this.sortHeaderData.direction === '')) {
      this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
      return this.policyApplicationArrCopy;
    }
    this.policyApplicationSearchCopy = data.sort((a, b) => {
      const isAsc = this.sortHeaderData.direction === 'asc';
      switch (this.sortHeaderData.active) {
        case 'Insurer Name': return this.compare(a.insurerName, b.insurerName, isAsc);
        case 'Product Name': return this.compare(a.productName, b.productName, isAsc);
        case 'Policy Number': return this.compare(a.applicationNo, b.applicationNo, isAsc);
        case 'Customer Name': return this.compare(a.customerName, b.customerName, isAsc);
        case 'Status': return this.compare(a.status, b.status, isAsc);
        case 'Premium': return this.compare(a.premiumAmount, b.premiumAmount, isAsc);
        case 'Product Id': return this.compare(a.productId, b.productId, isAsc);
        default: return 0;
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
    // this.policyApplicationArrCopy = [];
    // this.policyApplicationSearchCopy = [];
    // this.policyApplicationSearchCopy = this.getSearchResults();

    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
  }

  onInitiatePayment(application) {
    console.log(application);
    this.router.navigate(['/', 'initiate-payment', application]);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const policiesToDisplay = event.pageIndex * event.pageSize;
    this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(policiesToDisplay, policiesToDisplay + event.pageSize);
  }


  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    const searchResults = this.policyApplicationDetailsArr.filter(policyDetail => {

      const policyDetailString = JSON.stringify(policyDetail);
      if (policyDetailString.match(searchValue) || policyDetailString.toLocaleLowerCase().match(searchValue)) {
        return policyDetail;
      }


    });
    return searchResults;
  }
  onApprovePolicy(appno) {
    this.loaderService.showSpinner(true);
    this.spApprovalService.approveOrRejectPolicy(appno, 'Approve').subscribe(res => {
      console.log('printing result', res['applicationNo']);
      const appNo = res['applicationNo'];
      this.getPolicyApplicationDetails();
    });
  }
  onRejectPolicy(appNo) {
    this.spApprovalService.approveOrRejectPolicy(appNo, 'Reject').subscribe(res => {
      console.log('printing result', res);
      // if (res['status'] === 'PENDING') {
      // this.policyApplicationDetailsArr.filter(arr => {
      //   return arr.applicationNo !== res['applicationNo'];
      // });
      // }
    });
  }

}
