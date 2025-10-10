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

interface ServiceRequestMode {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-service-request-mode',
  templateUrl: './service-request-mode.component.html',
  styleUrls: ['./service-request-mode.component.css'],
  animations: [
    trigger('serviceRequestModeShowHide', [
      state('serviceRequestMode', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('serviceRequestNature', style({
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
      transition('serviceRequestMode <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class ServiceRequestModeComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  otherServiceRequest = false;

  // complaintModeOptions: string[] = ['Oral', 'Letter', 'Electronic', 'Others'];
  serviceRequestModeOptions: ServiceRequestMode[] = [
    { value: 'Oral', viewValue: 'Oral' },
    { value: 'Letter', viewValue: 'Letter' },
    { value: 'Electronic', viewValue: 'Electronic' },
    { value: 'Others', viewValue: 'Others' }
  ];

  constructor(private serviceRequestData: ServiceRequestDataService) { }

  ngOnInit() {
  }
  changeOption(e) {
    this.form.get('serviceRequestMode').setValue(e.value);
    this.serviceRequestData.setComplaintInfo('serviceRequestMode', this.form.get('serviceRequestMode').value);
    console.log('against', this.form.get('serviceRequestMode').value);
    console.log('form', this.form);

    const opt = this.form.get('serviceRequestMode').value;
    console.log('opybef', opt);
    if (opt === 'Others') {
      console.log('opy', opt);
      this.form.addControl('otherServiceRequestMode', new FormControl('', [Validators.required,
      Validators.minLength(5), Validators.maxLength(1500)]));
      this.otherServiceRequest = true;
      console.log('form new', this.form.get('otherServiceRequestMode').value);
    } else {
      this.otherServiceRequest = false;
      this.form.removeControl('otherServiceRequestMode');
    }

  }

}
