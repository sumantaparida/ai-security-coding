import { Component, OnInit, HostBinding, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import * as _ from "lodash";

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-valuables',
  templateUrl: './valuables.component.html',
  styleUrls: ['./valuables.component.css'],
  animations: [
    trigger('valuablesShowHide', [
      state('valuables', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('annualIncome', style({
        display: 'none',
        opacity: 0,
        marginTop: '-150px'
      })),
      state('*', style({
        marginTop: '150px',
        opacity: 0,
        display: 'none'
      })),
      transition('valuables <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class ValuablesComponent implements OnInit, OnChanges {

  @Input() state;
  @Input() form;
  valuablesList: string[] = [];
  vlauableStrList: string[] = [];
  // youngMan = true;
  gender;
  ageGroup;
  image1;
  image2;
  stringvalues;
  strVal;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    this.ageGroup = this.userDataService.getUserInfo().ageGroup;
    this.imageToDisplay();

  }

  onValuablesSelected(valuablesType, valueString) {
    const index = this.valuablesList.findIndex(valuable =>
      valuablesType === valuable
     );
    index > -1 ? this.valuablesList.splice(index, 1) : this.valuablesList.push(valuablesType);
    index > -1 ? this.vlauableStrList.splice(index, 1) : this.vlauableStrList.push(valueString);
    this.stringvalues = this.valuablesList.join(',');
    this.strVal = this.vlauableStrList.join(',');
    this.form.get('valuablesValue').setValue(this.stringvalues);
    console.log(this.form.get('valuablesValue').value, 'valueeeeeeeeeeeeeeeee');
    this.userDataService.setUserInfo('valuables', this.stringvalues);
    this.userDataService.setDisplayInfo('valuables', this.strVal);

  }

  imageToDisplay() {
    if (this.form.get('genderValue').value === 'M') {
      if (this.ageGroup === 'young') {
        this.image1 = 'Man 1 - Car';
        this.image2 = 'Man 1 - Bike';

      } else if (this.ageGroup === 'elder') {
        this.image1 = 'Man 2 - Car';
        this.image2 = 'Man 2 - Bike';
      } else if (this.ageGroup === 'senior') {
        this.image1 = 'Man 3 - Car';
        this.image2 = 'Man 3 - Bike';
      }
    } else if (this.form.get('genderValue').value === 'F') {
      if (this.ageGroup === 'young') {
        this.image1 = 'Lady 1 - car';
        this.image2 = 'Lady 1 - Bike';

      } else if (this.ageGroup === 'elder') {
        this.image1 = 'Lady 2 - car';
        this.image2 = 'Lady 2 - Bike';
      } else if (this.ageGroup === 'senior') {
        this.image1 = 'Lady 3 - Car';
        this.image2 = 'Lady 3 - Bike';
      }
    }
  }
}
