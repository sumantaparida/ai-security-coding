import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
import { CustomerApplications } from '@app/interface/Customer';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderService } from '@app/_services/loader.service';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { UploadDocumentService } from '@app/_services/upload-document.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MatDialog } from '@angular/material/dialog';

declare var require: any;
// const FileSaver = require('file-saver');

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

@Component({
  selector: 'app-bulk-upload-view',
  templateUrl: './bulk-upload-view.component.html',
  styleUrls: ['./bulk-upload-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BulkUploadViewComponent implements OnInit {
  customerId: number;

  columnsToDisplay = [
    'File Name',
    'Product Name',
    // 'Bank Name',
    'Uploaded ON',
    'Processed On',
    'Status',
    'Total Records',
    'Failed Count',
    'Error Report',
  ];

  responseData;

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

  displayedMobileColumns: string[] = [' ', 'File Name', 'Error Report'];

  isMobileView: boolean;

  paymentTerm;

  insuredDOB;

  insuredGender;

  insuredRel;

  isBranchUser = false;

  downloadLink;

  downloadDocuments;

  minDate: Date;

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

  productsForFilter;

  insurersForFilter;

  policyStatusForFilter;

  filterArr;

  banksForFilter;

  branchesForFilter;

  selectedBank;

  branchSelected;

  applicationDetails;

  constructor(
    private route: ActivatedRoute,
    private policyVaultService: PolicyVaultService,
    public media: MediaObserver,
    private breakPointObserver: BreakpointObserver,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private uploadDocumentService: UploadDocumentService,
    public dialog: MatDialog,
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
    this.uploadDocumentService.getDocumentMasterList('KB').subscribe(
      (products) => {
        // this.loaderService.showSpinner(false);
        this.productsForFilter = products['docList'];
      },
      (error) => {
        this.loaderService.showSpinner(false);
        console.log(error);
      },
    );

    this.currentUser = this.accountService.userValue;

    this.isBranchUser = this.accountService.isBranchUser;
    this.innerWidth = window.innerWidth;
    // this.resetDisplayedColumnsXtraSmall();
    this.searchForm = new FormGroup({
      // searchField: new FormControl(''),
      filterByProduct: new FormControl('KBLSuraksha'),
      filterByBank: new FormControl('KB'),
      // filterByBranch: new FormControl({ value: '', disabled: true }),
      // filterByStatus: new FormControl(''),
      // filterByDateStart: new FormControl(),
      // filterByDateEnd: new FormControl({ value: '', disabled: true })
    });

    // this.filterArr = this.searchForm.valueChanges.subscribe((val) => {
    //   console.log('form vbalue', val);
    //   return val;
    // });

    // this.getPolicyApplicationDetails();
    // this.isLoading = true;
    this.loaderService.showSpinner(true);

    this.getPolicyApplicationDetails();
  }
  // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
  // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
    // this.selectedBank = this.searchForm.get('filterByBank').value;
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
    // this.expandedElement = this.expandedElement === element ? null : element;
  }

  toggleBadgeVisibility() {
    // this.hidden = !this.hidden;
  }

  toggle(expanded) {
    // expanded = !expanded;
  }

  getPolicyApplicationDetails() {
    this.policyVaultService.getPolicyApplicationForUser().subscribe(
      (policyDetails) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = policyDetails;
        this.formatData();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.accountService.logout();
      },
    );

    const data = {
      orgCode: 'KB',
      documentKey: 'KBLSuraksha',
      cufOffDays: 10,
    };
    this.uploadDocumentService.getTransactionFiles(data).subscribe(
      (response) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = response['docList'];
        this.formatData();
        console.log('transactions', response);
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.accountService.logout();
      },
    );

    // this.policyVaultService.getAvailableProducts().subscribe(
    //   (products) => {
    //     // this.loaderService.showSpinner(false);
    //     this.productsForFilter = products;
    //   },
    //   (error) => {
    //     this.loaderService.showSpinner(false);
    //   }
    // );
    this.policyVaultService.getAllowedOrgForUser().subscribe(
      (banks) => {
        this.loaderService.showSpinner(false);
        this.banksForFilter = banks;
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
    // this.policyVaultService.getAllowedBranchesForUser(this.selectedBank).subscribe(
    //   (insurers) => {
    //     // this.loaderService.showSpinner(false);
    //     this.branchesForFilter = insurers;
    //   },
    //   (error) => {
    //     this.loaderService.showSpinner(false);
    //   }
    // );
    // this.policyVaultService.getMasterCodesPolicyStatus().subscribe(
    //   (policyStatus) => {
    //     // this.loaderService.showSpinner(false);
    //     this.policyStatusForFilter = policyStatus;
    //   },
    //   (error) => {
    //     this.loaderService.showSpinner(false);
    //   }
    // );
  }

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
    // this.sortData(this.sortHeaderData, true);
    if (this.searchForm.get('filterByBank').value !== '') {
      this.selectedBank = this.searchForm.get('filterByBank').value;
      this.uploadDocumentService.getDocumentMasterList(this.selectedBank).subscribe(
        (products) => {
          // this.loaderService.showSpinner(false);
          this.productsForFilter = products['docList'];
        },
        (error) => {
          this.loaderService.showSpinner(false);
          console.log(error);
        },
      );
    }

    if (
      this.searchForm.get('filterByProduct').value !== '' &&
      this.searchForm.get('filterByBank').value !== ''
    ) {
      this.loaderService.showSpinner(true);
      const documentKey = this.searchForm.get('filterByProduct').value;
      const data = {
        orgCode: this.selectedBank,
        documentKey,
        cufOffDays: 10,
      };
      this.uploadDocumentService.getTransactionFiles(data).subscribe(
        (response) => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          this.policyApplicationDetailsArr = response['docList'];
          this.formatData();
          // console.log('transactions', response);
        },
        (error) => {
          this.loaderService.showSpinner(false);
          console.log(error);
        },
      );
    }

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
    this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
      policiesToDisplay,
      policiesToDisplay + event.pageSize,
    );
  }

  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    const searchProduct = this.searchForm.get('filterByProduct').value.toLocaleLowerCase();
    const searchBank = this.searchForm.get('filterByBank').value.toLocaleLowerCase();
    const searchBranch =
      searchBank === '' ? '' : this.searchForm.get('filterByBranch').value.toLocaleLowerCase();
    const searchStatus = this.searchForm.get('filterByStatus').value.toLocaleLowerCase();
    const searchStartDate = this.searchForm.get('filterByDateStart').value;
    console.log(this.searchForm);
    const searchEndDate =
      searchStartDate === '' ? '' : this.searchForm.get('filterByDateEnd').value;
    if (searchBank === '') {
      this.searchForm.get('filterByBranch').setValue('');
      this.searchForm.controls.filterByBranch.disable();
    } else {
      this.searchForm.controls.filterByBranch.enable();
    }
    if (searchStartDate === null) {
      this.searchForm.get('filterByDateEnd').setValue('');
      this.searchForm.controls.filterByDateEnd.disable();
    } else {
      this.minDate = new Date(searchStartDate);
      this.searchForm.controls.filterByDateEnd.enable();
    }

    const filterObj = {
      orgCode: searchBank,
      branchName: searchBranch,
      productId: searchProduct,
      status: searchStatus,
    };

    const filterResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
      for (const key in filterObj) {
        if (filterObj[key] !== '') {
          if (
            policyDetail[key] === undefined ||
            policyDetail[key].toLocaleLowerCase() !== filterObj[key].toLocaleLowerCase()
          ) {
            return false;
          }
        }
      }
      return true;
    });
    const searchResults = this.getSearchAfterFilter(filterResults, searchValue);
    const dateResults = this.getDateFilter(searchResults, searchStartDate, searchEndDate);
    return dateResults;
    // const searchResults = this.policyApplicationDetailsArr.filter(
    //   (policyDetail) => {
    //     const policyDetailString = JSON.stringify(policyDetail);

    //     if (policyDetailString.match(searchInsurer) ||
    //       policyDetailString.toLocaleLowerCase().match(searchInsurer)) {
    //       console.log('ininsde 2nd');

    //       if (
    //         policyDetailString.match(searchProduct) ||
    //         policyDetailString.toLocaleLowerCase().match(searchProduct)
    //       ) {

    //         if (policyDetailString.match(searchStatus) ||
    //           policyDetailString.toLocaleLowerCase().match(searchStatus)) {
    //           return policyDetail;
    //         }
    //       }
    //     }
    //   }
    // );
    // console.log(searchResults);
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

  base64ToArrayBuffer(responseData) {
    var binaryString = window.atob(responseData);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    // var fileName = reportName;
    // link.download = `BulkUploadTemplate_${this.selectedLob}.xlsx`;
    link.download = `BulkUploadErrorReport.xlsx`;

    link.click();
  }

  downloadReport(id) {
    this.uploadDocumentService.getErrorReport(id).subscribe(
      (download) => {
        this.loaderService.showSpinner(false);
        this.responseData = download;
        let convertedArr = this.base64ToArrayBuffer(this.responseData);
        this.saveByteArray(convertedArr);
        this.router.navigate(['/lms']);
      },
      (error) => {
        this.loaderService.showSpinner(false);
        console.log('error downloading', error);
        this.dialog.open(PolicyErrorModalComponent, {
          data: 'Unable to download file, Please try again later.',
          panelClass: 'dialog-width',
        });
      },
    );
  }
}
