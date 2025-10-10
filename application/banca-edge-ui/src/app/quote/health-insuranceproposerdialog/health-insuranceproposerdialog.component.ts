import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-health-insuranceproposerdialog',
  templateUrl: './health-insuranceproposerdialog.component.html',
  styleUrls: ['./health-insuranceproposerdialog.component.css']
})
export class HealthInsuranceproposerdialogComponent implements OnInit {



  constructor() { }

  ngOnInit(): void {
    
  }

}
