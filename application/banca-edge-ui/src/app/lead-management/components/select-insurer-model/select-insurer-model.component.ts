import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-insurer-model',
  templateUrl: './select-insurer-model.component.html',
  styleUrls: ['./select-insurer-model.component.css'],
})
export class SelectInsurerModelComponent implements OnInit {
  selectInsurerForm = this.fb.group({
    selectInsurer: ['', Validators.required],
  });

  insurerList;

  constructor(
    public dialogRef: MatDialogRef<SelectInsurerModelComponent>,
    private leadManagement: LeadManagementService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.leadManagement.getFromMaster(this.data.lob, this.data.productType).subscribe((values) => {
      this.insurerList = values;
      console.log('PRINTING INSURER LIST', this.insurerList);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelect() {
    this.dialogRef.close(this.selectInsurerForm.get('selectInsurer').value);
  }

  closeDialog() {
    this.dialogRef.close(this.insurerList);
  }
}
