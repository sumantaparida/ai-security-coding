import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-kyc-modal',
  templateUrl: './field-modal.component.html',
  styleUrls: ['./field-modal.component.css']
})
export class FieldModalComponent implements OnInit {

  formGroup= new FormGroup({
  });
  constructor(
    public dialogRef: MatDialogRef<FieldModalComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit(): void {
   console.log(this.data)
    if(this.data.formData.length>0){
      this.addForms();
      this.setForms();
      this.fecthData();
    }
    
  }

  getValidators(validator,validatorObj){
    switch(validator) {
      case 'required': return Validators.required;break;
      case 'pattern': return Validators.pattern(validatorObj[validator]);break;
      default: break;
    }

  }

  onSelect(){
    const submitData = this.formGroup.value
    this.dialogRef.close(
      submitData
    )
  }

  onClose(){
    this.dialogRef.close('Cancel'
    )
  }

  onSelectionChange(input){
   
    const  requiredField = input.options.find(field=>{
     
       return field.id === this.formGroup.get('idType').value
      })
      console.log(requiredField)
    if(requiredField.getDetail){
      const reqValue = this.data[requiredField.setValFrom.obj][requiredField.setValFrom.tag];
      this.formGroup.get(requiredField.setValFrom.controlName).setValue(reqValue);
    }
  }

  fecthData(){
    this.data.formData.forEach(field => {
      if(field.master){
         this.http.get(
          `${environment.apiUrl}/api/v1/master/getMasterCodes/${field.master}/${this.data.insurerId}`,
        ).subscribe(options=>
          {
            field.options = options

          },(error)=>{
            console.log(error)
          });
        console.log(field.master)
      }
      
      });
  }

  addForms(){
    this.data.formData.forEach(field => {
      //  const validatorsArr = field.validators.map(validator =>{return this.getValidators(validator)})
       const validatorsArr = Object.keys(field.validators).map(validator=>{return this.getValidators(validator,field.validator)})
       this.formGroup.addControl(field.controlName ,new FormControl('',validatorsArr))
       if(field.defaultValue){
        this.formGroup.get(field.controlName).setValue(field.defaultValue);
       }
      });
  }

  setForms(){
    this.data.formData.forEach(field => {
    if(field.setOtherVal){
      const reqValue = this.data[field.setValFrom.obj][field.setValFrom.tag];
      this.formGroup.get(field.setValFrom.controlName).setValue(reqValue);
     }
    });
  }

}
