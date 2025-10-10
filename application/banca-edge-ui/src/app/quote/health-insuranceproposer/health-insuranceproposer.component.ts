import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {ProtectionComponent} from '../protection/protection.component';
import {MatStepper} from '@angular/material/stepper';
import { HealthInsuranceproposerdialogComponent } from '../health-insuranceproposerdialog/health-insuranceproposerdialog.component';

@Component({
  selector: 'app-health-insuranceproposer',
  templateUrl: './health-insuranceproposer.component.html',
  styleUrls: ['./health-insuranceproposer.component.css']
})
export class HealthInsuranceproposerComponent implements OnInit {

 
  constructor(private _formBuilder: FormBuilder,public dialog: MatDialog) { }

  ngOnInit(): void {
    
  }
  

}
