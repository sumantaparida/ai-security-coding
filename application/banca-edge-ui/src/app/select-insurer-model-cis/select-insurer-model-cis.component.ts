import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';

@Component({
  selector: 'app-select-insurer-model-cis',
  templateUrl: './select-insurer-model-cis.component.html',
  styleUrls: ['./select-insurer-model-cis.component.css'],
})
export class SelectInsurerModelCisComponent implements OnInit {
  selectInsurerForm = this.fb.group({
    selectInsurer: ['', Validators.required],
    selectProduct: [''],
  });

  insurerList;

  productList;

  spCodeList;

  reqSpCodeInsurer = ['134'];

  constructor(
    public dialogRef: MatDialogRef<SelectInsurerModelCisComponent>,
    private leadManagement: LeadManagementService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // console.log(this.data.lob,this.data.productType)
    this.leadManagement.getFromMaster(this.data.lob, this.data.productType).subscribe((values) => {
      this.insurerList = values;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelect() {
    let insurerData = {
      insurerId: this.selectInsurerForm.get('selectInsurer').value,
      lob: this.selectInsurerForm.get('selectProduct').value,
    };
    this.dialogRef.close(insurerData);
  }

  closeDialog() {
    this.dialogRef.close(this.insurerList);
  }

  onSelectionChanged(event) {
    if(this.data.needLob){
      this.leadManagement.getProductsFromMaster(event.value).subscribe((products) => {
        this.productList = products;
      });
    }
    
  }

  onSelectionChangedProduct(event) {
    console.log(event.value);
  }
}
