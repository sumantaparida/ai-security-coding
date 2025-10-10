import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-medical-requirement',
  templateUrl: './medical-requirement.component.html',
  styleUrls: ['./medical-requirement.component.css'],
})
export class MedicalRequirementComponent implements OnInit {
  medicalTestList = [
    { id: 1, name: 'BP' },
    { id: 2, name: 'CBC' },
    { id: 3, name: 'TMT' },
    { id: 4, name: 'Sugar' },
    { id: 5, name: 'Others' },
  ];

  statusList = [
    { id: 1, name: 'Raised' },
    { id: 2, name: 'Completed' },
  ];

  medicalTestForm;

  constructor(private dialogRef: MatDialogRef<MedicalRequirementComponent>) {}

  ngOnInit(): void {
    this.medicalTestForm = new FormGroup({
      status: new FormControl(''),
      medicalTest: new FormControl(''),
      description: new FormControl(''),
    });
  }

  addTest() {
    const test = {
      status: this.medicalTestForm.get('status').value,
      medicalTest: this.medicalTestForm.get('medicalTest').value,
      description: this.medicalTestForm.get('description').value,
    };

    this.dialogRef.close(test);
  }
}
