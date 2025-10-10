import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./view-application.component.css']
})
export class ViewApplicationComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['LoanAppNumber', 'Type of Loan', 'Status', 'Premium', 'Customer Name'];
  expandedElement: PeriodicElement | null;

  inforceStatusCount = 0;
  pendingStatusCount = 0;
  inactiveStatusCount = 0;
  initiatedStatusCount = 0;
  searchForm: FormGroup;

  constructor(
    public media: MediaObserver,

  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField : new FormControl('')
    })
  }
  onSearchFieldChange(){

  }
}
export interface PeriodicElement {
  LoanAppNumber: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    LoanAppNumber: 'Test 1',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    LoanAppNumber: 'Test 2',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    LoanAppNumber: 'Test 3',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 4,
    LoanAppNumber: 'Test 4',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 5,
    LoanAppNumber: 'Test 5',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }
];