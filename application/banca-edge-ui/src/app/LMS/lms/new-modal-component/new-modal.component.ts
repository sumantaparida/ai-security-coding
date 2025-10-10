import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-new-modal',
  templateUrl: './new-modal.component.html',
  styleUrls: ['./new-modal.component.css'],
})
export class NewModalComponent implements OnInit {
  isCreateLead;

  appArr;

  appStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<NewModalComponent>,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.loaderService.showSpinner(false);
    
  }

  onOkClicked() {
    this.dialogRef.close();
  }
}
