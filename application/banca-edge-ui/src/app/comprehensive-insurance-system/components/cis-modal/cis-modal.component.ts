import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cis-modal',
  templateUrl: './cis-modal.component.html',
  styleUrls: ['./cis-modal.component.css']
})
export class CisModalComponent implements OnInit {
  checked;
  modelFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CisModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }
    details = []
   
  ngOnInit(): void {

    console.log(this.data.type)
    if(this.data.type === 'reject'){
      this.modelFormGroup = new FormGroup({
        'rejectComment' : new FormControl('',Validators.required)
      })
    }
      if(this.data.details){
        this.details= Object.keys(this.data.details)
        this.checked=false;
      }
  }
  toggleChecked(){
    this.checked=!this.checked
  }
  onSubmit(){
    // console.log('HI')
    this.dialogRef.close();
  }
  onCancel(){
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
  onCancelReject(){
    this.dialogRef.close();
  }
  
  onReject(){
    this.dialogRef.close(this.modelFormGroup.get('rejectComment').value);
    
  }
}
