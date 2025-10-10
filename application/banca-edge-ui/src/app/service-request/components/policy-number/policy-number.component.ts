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
import { ServiceRequestDataService } from '../../services/service-request-data.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from '@app/_services/loader.service';
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
        marginTop: '-50px'
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
        animate('1s')
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
  constructor(
    private serviceRequestData: ServiceRequestDataService,
    private router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // console.log(this.policyDetails, 'details fetched');
    this.route.queryParams.subscribe(params => {
      if (params.appno) {
        this.appNo = params.appno;
        this.loaderService.showSpinner(true);
        setTimeout(() => {
          this.loaderService.showSpinner(false);
          this.form.patchValue({
            policyNumber: this.appNo,
          });
          // this.makeReadOnly(this.appNo);
        }, 2000);
      }
    });
  }

  makeReadOnly(id: number) {
    console.log('id of data', id);
    return id !== null ? true : false;
  }

  onKeyUp() {
    // console.log(this.form.get('policyNumber').value);
    this.serviceRequestData.setComplaintInfo('policyNumber', this.form.get('policyNumber').value);
    this.serviceRequestData.setComplaintInfo('status', 'Open');
    this.date = Date.now();
    this.serviceRequestData.setComplaintInfo('openDate', this.date);
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
    this.serviceRequestData.setComplaintInfo('detailsCorrection', this.form.get('detailsCorrection').value);
  }

}
