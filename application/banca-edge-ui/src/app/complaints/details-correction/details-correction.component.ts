import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ComplaintDataService } from '../complaint-data.service';

@Component({
  selector: 'app-details-correction',
  templateUrl: './details-correction.component.html',
  styleUrls: ['./details-correction.component.css'],
  animations: [
    trigger('detailsCorrectionShowHide', [
      state('detailsCorrection', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('customerMail', style({
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
      transition('detailsCorrection <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class DetailsCorrectionComponent implements OnInit {

  @Input() state;
  @Input() form;
  constructor(private complaintData:ComplaintDataService) { }

  ngOnInit() {
  }

  onCorrectionSelected(status) {
    if (status === 'yes') {
      this.form.get('detailsCorrection').setValue('yes');
    } else {
      this.form.get('detailsCorrection').setValue('no');
    }
    this.complaintData.setComplaintInfo('detailsCorrection', this.form.get('detailsCorrection').value);    
  }
}
