import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { UserDataService } from '../user-data.service';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-risk-type',
  templateUrl: './risk-type.component.html',
  styleUrls: ['./risk-type.component.css'],
  animations: [
    trigger('riskTypeShowHide', [
      state(
        'riskType',
        style({
          display: 'block',
          opacity: 1,
          marginTop: '0px',
        }),
      ),
      state(
        'houseType',
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
          display: 'none',
          opacity: 0,
        }),
      ),
      transition('riskType <=> *', [animate('1s')]),
    ]),
  ],
})
export class RiskTypeComponent implements OnInit {
  riskDefiniton = '';

  @Input() state;

  orgCode;

  user;

  @Input() form: FormGroup;

  @Output() stateChange = new EventEmitter();

  constructor(private userDataService: UserDataService, private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      this.orgCode = user.organizationCode;
    });
    // this.form.get('riskTypeValue').setValue(1);
    // this.userDataService.setUserInfo('riskType', 'Varun');
    // this.userDataService.setDisplayInfo('riskType', 'Varun');
  }

  onRiskSelected(riskLevel) {
    if (riskLevel === 'Minimal') {
      this.form.get('riskTypeValue').setValue(1);
      this.userDataService.setUserInfo('riskType', 1);
      this.userDataService.setDisplayInfo('riskType', 'Minimal');
      this.riskDefiniton = `
      My priority is capital preservation and
       I am willing to accept minimal risks. In return, 
       I understand that I may receive minimal or low returns.`;
    } else if (riskLevel === 'Moderate') {
      this.form.get('riskTypeValue').setValue(2);
      this.userDataService.setUserInfo('riskType', 2);
      this.userDataService.setDisplayInfo('riskType', 'Moderate');
      this.riskDefiniton = `
      I am willing to accept small/moderate level of risk in 
      exchange for higher potential returns over the medium to long term`;
    } else if (riskLevel === 'Significant') {
      this.form.get('riskTypeValue').setValue(3);
      this.userDataService.setUserInfo('riskType', 3);
      this.userDataService.setDisplayInfo('riskType', 'Significant');
      this.riskDefiniton = `I am willing to accept high or significant 
      risks to maximise my potential returns over the medium to long term. 
      I accept that I may lose a significant part or all my capital.`;
    }
  }

  onRiskChange(event) {
    console.log('event', event);
    this.form.get('riskTypeValue').setValue(event);
    this.userDataService.setUserInfo('riskType', event);
    let risk = 'Minimal';
    if (event === 1) {
      risk = 'Minimal';
    } else if (event === 2) {
      risk = 'Moderate';
    } else if (event === 3) {
      risk = 'Aggressive';
    } else if (event === 4) {
      risk = 'Risk Averse';
    } else if (event === 5) {
      risk = 'Conservative';
    } else if (event === 6) {
      risk = 'Moderately Conservative';
    } else if (event === 7) {
      risk = 'Moderately Aggressive';
    } else if (event === 8) {
      risk = 'Aggressive';
    }
    this.userDataService.setDisplayInfo('riskType', risk);
  }

  onStateChange(event) {
    this.stateChange.emit(true);
  }
}
