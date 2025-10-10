
import { Component, Inject, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDcbService } from '@app/user-dcb/service/user-dcb-service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-pop-up-msg',
  templateUrl: './pop-up-msg.component.html',
  styleUrls: ['./pop-up-msg.component.css']
})
export class PopUpMsgComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PopUpMsgComponent>,
    private uamService: UserDcbService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }
}
