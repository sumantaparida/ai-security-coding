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
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.css'],
  animations: [
    trigger('maritalStatusShowHide', [
      state('maritalStatus', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('kids', style({
        display: 'none',
        marginTop: '-150px',
        opacity: 0      
      })),
      state('occupation', style({
        display: 'none',
        marginTop: '-150px',
        opacity: 0
        
      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity: 0
      })),
      transition('maritalStatus <=> *', [
        animate('1s')
      ])
    ])
  ]
})

export class MaritalStatusComponent implements OnInit {

  @Input() state;
  @Input() form;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    console.log('marital',state)
  }

  onMaritalStatusSelected(status) {
    if (status === 'single') {
      this.form.get('maritalStatusValue').setValue('Single');
    } else {
      this.form.get('maritalStatusValue').setValue('Married');
    }
    this.userDataService.setUserInfo('maritalStatus', this.form.get('maritalStatusValue').value);
    this.userDataService.setDisplayInfo('maritalStatus', this.form.get('maritalStatusValue').value);
  }
}
