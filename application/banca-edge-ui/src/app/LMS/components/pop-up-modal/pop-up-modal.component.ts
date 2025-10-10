import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-pop-up-modal',
  templateUrl: './pop-up-modal.component.html',
  styleUrls: ['./pop-up-modal.component.css'],
})
export class PopUpModalComponent implements OnInit {
  isAccept;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PopUpModalComponent>,
    private loaderService: LoaderService,
    private lmsService: LmsService,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.isAccept = this.data;
  }

  close() {
    this.dialogRef.close();
  }
}
