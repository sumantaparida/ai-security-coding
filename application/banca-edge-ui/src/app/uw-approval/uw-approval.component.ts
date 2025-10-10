import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UwService } from './uw-decission/services/uw.service';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { LoaderService } from '@app/_services/loader.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-uw-approval',
  templateUrl: './uw-approval.component.html',
  styleUrls: ['./uw-approval.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UwApprovalComponent implements OnInit {
  uwPolicies;
  uwPoliciesCopy;
  uwSearchPoliciesCopy;
  expandedElement;
  searchForm: FormGroup;
  pageSize = 5;
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  sortHeaderData: Sort;
  columnsToDisplay = [
    ' ',
    'Insurer Name',
    'Product Name',
    'Application Number',
    'Customer Name',
    'Status',
    'Action',
  ];
  pageIndex;
  loadingError = false;

  user;

  orgCode;

  constructor(
    private uwService: UwService,
    public media: MediaObserver,
    private loaderService: LoaderService,
    private route: Router,
    private accountService: AccountService,

  ) {
    this.accountService.user.subscribe((x) => (this.user = x));

  }

  ngOnInit() {
    this.orgCode = this.user?.organizationCode;
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });

    this.loaderService.showSpinner(true);
    this.uwService.getUwPolicy().subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        this.uwPolicies = values;
        this.uwSearchPoliciesCopy = this.uwPolicies.slice();
        this.uwPoliciesCopy = this.uwPolicies.slice(0, this.pageSize);
      },
      () => {
        this.loaderService.showSpinner(false);
        this.loadingError = true;
      },
    );
  }

  onSearchFieldChange() {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.sortData(this.sortHeaderData, true);
  }

  sortData(sort: Sort, isSearching?: boolean) {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    if (isSearching && sort !== undefined) {
      this.sortHeaderData = sort;
      this.uwSearchPoliciesCopy = this.getSearchResults().slice();
      this.uwPoliciesCopy = this.getSortedData();
    } else if (isSearching) {
      this.paginator.pageIndex = 0;
      this.pageIndex = 0;
      this.uwSearchPoliciesCopy = this.getSearchResults().slice();
      this.uwPoliciesCopy = this.uwSearchPoliciesCopy.slice(0, this.pageSize);
    } else {
      this.sortHeaderData = sort;
      this.uwPoliciesCopy = [];
      this.uwPolicies.slice();
      this.uwSearchPoliciesCopy = this.getSearchResults().slice();
      this.uwPoliciesCopy = this.getSortedData();
    }
  }

  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    const searchResults = this.uwPolicies.filter((policyDetail) => {
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

  getSortedData() {
    const data = this.uwSearchPoliciesCopy.slice();
    if (
      this.sortHeaderData &&
      (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
    ) {
      this.uwPoliciesCopy = this.uwSearchPoliciesCopy.slice(this.pageIndex, this.pageSize);
      return this.uwPoliciesCopy;
    }
    this.uwSearchPoliciesCopy = data.sort((a, b) => {
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
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const policiesToDisplay = event.pageIndex * event.pageSize;
    this.uwPoliciesCopy = this.uwSearchPoliciesCopy.slice(
      policiesToDisplay,
      policiesToDisplay + event.pageSize,
    );
  }
}
