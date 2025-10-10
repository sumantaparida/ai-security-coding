import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { MediaObserver } from '@angular/flex-layout';
import { Clipboard } from '@angular/cdk/clipboard';

import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { FormGroup, FormControl } from '@angular/forms';
import { lrrService } from '@app/_services/lrr.service';
import { LoaderService } from '@app/_services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-lrr',
  templateUrl: './lrr.component.html',
  styleUrls: ['./lrr.component.css'],
})
export class LrrComponent implements OnInit {
  customerId: number;

  columnsToDisplay = ['Lead ID', 'Insurer Request', 'Insurer Response'];

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

  expandedElement;

  hidden = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  isLoading = false;

  isMobileView = false;

  innerWidth;

  displayedColumns: string[] = [];

  displayedMobileColumns: string[] = [' ', 'Lead ID'];

  myVar = null;

  user;

  reqBody = {
    pageNo: this.pageIndex + 1,
    pageSize: this.pageSize,
    searchData: '',
  };

  totalRecords;

  constructor(
    private route: ActivatedRoute,
    private lrrService: lrrService,
    public dialog: MatDialog,
    public media: MediaObserver,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private router: Router,
    private clipboard: Clipboard,
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
    this.accountService.user.subscribe((val) => {
      this.user = val;
      console.log(this.user);
      // if (!this.user.userGroups.includes('LRR')) {
      //   window.location.href = '/mycustomers';
      // }
    });
    this.displayedColumns = this.columnsToDisplay;
    console.log('column ', this.displayedColumns);

    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');
    this.innerWidth = window.innerWidth;

    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.loaderService.showSpinner(true);
    this.getLRRDetails(this.reqBody);
  }

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();

    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');
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

  copyItemOnClick(LeadData) {
    const successful = this.clipboard.copy(JSON.stringify(LeadData));
  }

  getLRRDetails(reqPayload) {
    this.loaderService.showSpinner(true);

    this.lrrService.getLRR(reqPayload).subscribe(
      (lrrDetails) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = lrrDetails['leadDataDto'];
        this.totalRecords = lrrDetails['totalRecords'];

        console.log('check data', this.policyApplicationDetailsArr);
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchFieldChange() {
    // this.paginator.pageIndex = 0;
    // this.pageIndex = 0;
    // this.sortData(this.sortHeaderData, true);
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    let reqBody = {
      pageNo: event.pageIndex + 1,
      pageSize: event.pageSize,
      searchData: '',
      branch: 0,
      product: '',
      status: 0,
      startDate: '',
      endDate: '',
    };
    // const policiesToDisplay = event.pageIndex * event.pageSize;
    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
    //   policiesToDisplay,
    //   policiesToDisplay + event.pageSize,
    // );

    this.getLRRDetails(reqBody);
  }

  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    let reqBody = {
      pageNo: 1,
      pageSize: this.pageSize,
      searchData: searchValue,
      branch: 0,
      product: '',
      status: 0,
      startDate: '',
      endDate: '',
    };
    this.getLRRDetails(reqBody);
  }

  showOrHide(column) {
    return this.displayedMobileColumns.indexOf(column) === -1;
  }
}
