import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ServiceRequestDataService } from '../../services/service-request-data.service';

//  Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-customer-mail-id',
  templateUrl: './customer-mail-id.component.html',
  styleUrls: ['./customer-mail-id.component.css'],
  animations: [
    trigger('customerMailShowHide', [
      state('customerMail', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('serviceRequestAgainst', style({
        // display: 'none',
        display: 'none',
        opacity: 0,
        marginTop: '-150px'

      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity: 0,

      })),
      transition('customerMail <=> *', [
        animate('1s')
      ])
    ])
  ]

})
export class CustomerMailIdComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  // customerMailId = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);

  constructor(private serviceRequestData: ServiceRequestDataService) { }

  ngOnInit() {
  }

  onKeyUp() {
    // console.log(this.form.get('customerMailId').value);
    this.serviceRequestData.setComplaintInfo('customerMailId', this.form.get('customerMailId').value);
  }

}
