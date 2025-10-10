import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuoteService } from '../quote.service';



@Component({
  selector: 'app-select-customer-modal',
  templateUrl: './select-customer-modal.component.html',
  styleUrls: ['./select-customer-modal.component.css']
})
export class SelectCustomerModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SelectCustomerModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public toSend: ,
    private router: Router,
    // @Inject(MAT_DIALOG_DATA) public data: ,
    private quoteService: QuoteService
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }
  addCustomer() {
    this.dialogRef.close('add');
  }


}

