import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ServiceRequestDataService } from '../../services/service-request-data.service';

interface ServiceRequestNature {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-service-request-nature',
  templateUrl: './service-request-nature.component.html',
  styleUrls: ['./service-request-nature.component.css'],
  animations: [
    trigger('serviceRequestNatureShowHide', [
      state('serviceRequestNature', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('uploadDocument', style({
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
      transition('serviceRequestNature <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class ServiceRequestNatureComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;

  otherServiceRequest = false;
  claimComplaint = false;

  // complaintNatureOptions: string[] = ['Claim', 'Others'];
  serviceRequestNatureOptions: ServiceRequestNature[] = [
    { value: 'Claim', viewValue: 'Claim' },
    { value: 'Others', viewValue: 'Others' },
  ];

  constructor(private serviceRequestData: ServiceRequestDataService) { }



  ngOnInit() {

  }

  changeOption(e) {
    this.form.get('serviceRequestNature').setValue(e.value);
    this.serviceRequestData.setComplaintInfo('serviceRequestNature', this.form.get('serviceRequestNature').value);
    console.log('nature', this.form.get('serviceRequestNature').value);
    console.log('form', this.form);

    const opt = this.form.get('serviceRequestNature').value;
    console.log('opybef', opt);
    if (opt === 'Others') {
      console.log('opy', opt);
      this.form.addControl('otherServiceRequestNature', new FormControl('', [Validators.required,
      Validators.minLength(5), Validators.maxLength(1500)]));
      this.otherServiceRequest = true;
      console.log('form new', this.form.get('otherServiceRequestNature').value);
      this.claimComplaint = false;
      this.form.removeControl('claimDescriptive');
      this.form.removeControl('claimNumber');

    } else if (opt === 'Claim') {
      this.form.addControl('claimNumber', new FormControl('', [Validators.required]));
      this.form.addControl('claimDescriptive', new FormControl('', [Validators.required,
      Validators.minLength(5), Validators.maxLength(1500)]));

      this.claimComplaint = true;
      this.otherServiceRequest = false;
      this.form.removeControl('otherServiceRequestNature');
    }
    // else {
    //   this.otherComplaint = false;
    //   this.form.removeControl('otherComplaintNature');
    // }
  }

}
