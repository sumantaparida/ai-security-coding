import { Component, OnInit } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-uw-add-note-model',
  templateUrl: './customer-search-model.component.html',
  styleUrls: ['./customer-search-model.component.css'],
})
export class CustomerSearchModelComponent implements OnInit {
  customerSelected = false;
  customer;

  constructor(private dialogRef: MatDialogRef<CustomerSearchModelComponent>) {}

  ngOnInit(): void {}

  onCustomerSelected(customer) {
    this.customer = customer;
    this.customerSelected = true;
  }
}
