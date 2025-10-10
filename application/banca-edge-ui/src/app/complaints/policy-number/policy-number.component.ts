import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ComplaintDataService } from '../complaint-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-policy-number',
  templateUrl: './policy-number.component.html',
  styleUrls: ['./policy-number.component.css'],
  providers: [DatePipe],
  animations: [

    trigger('policyShowHide', [
      state('policy', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('detailsCorrection', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('detailsCorrection', style({
        display: 'block',
        opacity: 1,
        marginTop: '-15px'
      })),
      state('customerMail', style({
        // display: 'none',
        display: 'none',
        opacity: 0,
        marginTop: '-150px'

      })),
      state('*', style({
        display: 'none',
        opacity: 0,
        marginTop: '150px'
      })),
      transition('policy <=> *', [
        animate('0.5s')
      ]),
      transition('detailsCorrection <=> *', [
        animate('1s')
      ])
    ])
  ]

})
export class PolicyNumberComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  @Input() policyDetails;
  @Input() isLoading;
  @Output() yesOrNoClicked = new EventEmitter();
  textInput = '';
  date: number = Date.now();
  value = '';
  isLoader;
  appNo = null;
  constructor(private complaintData: ComplaintDataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // console.log(this.policyDetails, 'details fetched');
    this.route.queryParams.subscribe(params => {
      if (params.complaintNo) {
        this.appNo = params.complaintNo;
        this.isLoader = true;
        setTimeout(() => {
          this.isLoader = false;
          this.form.patchValue({
            policyNumber: this.appNo,
          });
        }, 2000);
      }
    });
  }

  makeReadOnly(id: number) {
    console.log('id of data', id);
    return id !== null ? true : false;
  }

  onKeyUp() {
    this.complaintData.setComplaintInfo('policyNumber', this.form.get('policyNumber').value);
    this.complaintData.setComplaintInfo('status', 'Open');
    this.date = Date.now();
    this.complaintData.setComplaintInfo('openDate', this.date);
  }


  onCorrectionSelected(status) {
    if (status === 'yes') {
      this.form.get('detailsCorrection').setValue('yes');
      this.yesOrNoClicked.emit('yes');
    } else {
      this.form.get('detailsCorrection').setValue('no');
      this.yesOrNoClicked.emit('no');
      this.form.get('policyNumber').reset();
    }
    this.complaintData.setComplaintInfo('detailsCorrection', this.form.get('detailsCorrection').value);
  }

}
