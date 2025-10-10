import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  selector: 'app-annual-income',
  templateUrl: './annual-income.component.html',
  styleUrls: ['./annual-income.component.css'],
  animations: [
    trigger('annualIncomeShowHide', [
      state('annualIncome', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('savings', style({
        display: 'none',
        opacity: 0,
        marginTop: '-150px'
      })),
      state('*', style({
        marginTop: '150px',
        opacity: 0,
        display: 'none'
      })),
      transition('annualIncome <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class AnnualIncomeComponent implements OnInit {
  textInput = '';
  @Input() state;
  @Input() form: FormGroup;
  showTicks = true;
  tickInterval = 500000;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    // const val = this.form.get('annualIncomeValue').value;
    this.form.controls['annualIncomValue'].valueChanges.subscribe(income => {
      console.log('changes=', income);
      const val = income;
      this.userDataService.setDisplayInfo('annualIncome', val);
      this.userDataService.setUserInfo('annualIncome', this.form.get('annualIncomValue').value);
    })
    // this.form.get('annualIncomValue').setValue(val);

  }

  // onKeyUp(event) {

  //   const val = this.form.get('annualIncomeValue')?.value;
  //   // this.form.get('annualIncomValue').setValue(val);
  //   this.userDataService.setDisplayInfo('annualIncome', val);
  //   this.userDataService.setUserInfo('annualIncome', this.form.get('annualIncomValue').value);

  // }
  math(value) {
    if (value >= 100000 && value <= 9999999) {
      // this.userDataService.setDisplayInfo('savings', Math.round(value / 100000));
      return Math.round(value / 100000) * 100000;
    } else if (value > 10000000) {
      return Math.round(value / 100000) * 100000;
    }
  }

  formatLabel(value: number) {
    if (value >= 100000 && value < 9999999) {
      return Math.round(value / 100000) + 'L';
    } else if (value > 9999999) {
      return '>' + '1Cr';
    }
  }

  getSliderTickInterval() {

    return this.tickInterval;
  }
  // return value;

  get formError() {
    return this.form.controls;
  }
}
