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
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  animations: [
    trigger('savingsShowHide', [
      state(
        'savings',
        style({
          display: 'block',
          opacity: 1,
          marginTop: '0px',
        }),
      ),
      state(
        'needLoan',
        style({
          display: 'none',
          opacity: 0,
          marginTop: '-150px',
        }),
      ),
      state(
        '*',
        style({
          marginTop: '150px',
          opacity: 0,
          display: 'none',
        }),
      ),
      transition('savings <=> *', [animate('1s')]),
    ]),
  ],
})
export class SavingsComponent implements OnInit {
  textInput = '';

  @Input() state;

  @Input() form: FormGroup;

  tickInterval = 50000;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {}

  onKeyUp(event) {
    const val = this.math(event.value);
    this.form.get('savingsValue').setValue(val);
    this.userDataService.setDisplayInfo('savings', val);
    this.userDataService.setUserInfo('savings', this.form.get('savingsValue').value);
  }

  math(value) {
    if (value >= 10000 && value <= 99999) {
      return Math.round(value / 1000) * 1000;
    } else if (value >= 100000 && value <= 9999999) {
      return Math.round(value / 100000) * 100000;
    } else if (value >= 10000000) {
      return Math.round(value / 100000) * 100000;
    }
  }

  formatLabel(value: number) {
    if (value >= 10000 && value <= 99999) {
      return Math.round(value / 1000) + 'k';
    } else if (value >= 100000 && value <= 9499999) {
      return Math.round(value / 100000) + 'L';
    } else if (value >= 1000000) {
      return '>' + Math.round(value / 1000000) + '10L';
    }
  }

  getSliderTickInterval() {
    return this.tickInterval;
  }
}
