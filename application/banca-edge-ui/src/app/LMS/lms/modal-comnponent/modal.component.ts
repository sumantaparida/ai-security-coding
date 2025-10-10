import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  isCreateLead;

  appArr;

  appStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ModalComponent>,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.loaderService.showSpinner(false);
    if (!this.data['message']) {
      this.isCreateLead = true;
      this.appArr = this.data.aplications;
      this.appStatus = this.data.appStatus;
    }
  }

  onOkClicked() {
    this.dialogRef.close();
  }
}
