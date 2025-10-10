import { Component, OnInit,HostBinding, Input } from '@angular/core';
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
  selector: 'app-need-loan',
  templateUrl: './need-loan.component.html',
  styleUrls: ['./need-loan.component.css'],
  animations: [
    trigger('needLoanShowHide', [
      state('needLoan', style({
        display: 'block',
        opacity:1,
        marginTop: '0px'
      })),
      state('', style({
        display: 'none',
        opacity:0,
        marginTop: '-150px'
      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity:0
      })),
      transition('needLoan <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class NeedLoanComponent implements OnInit {

  @Input() state;
  @Input() form;
  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
  } 

  onLoanSelected(loanNeed){
    if(loanNeed === 'yes'){
      this.form.get('needLoanValue').setValue('Yes');
    }else if(loanNeed === 'no'){
      this.form.get('needLoanValue').setValue('No');
    }
    this.userDataService.setUserInfo('needLoan', this.form.get('needLoanValue').value);
    
  }

}
