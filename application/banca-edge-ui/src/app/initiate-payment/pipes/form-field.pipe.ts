import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Pipe({
  name: 'displayInputField',
})
export class DisplayInputFieldPipe implements PipeTransform {
  applicationDetails;
  accountDetails;
  
  transform(
    input:any,
    isDependent,
    controlName,
    parentValue,
    formGroup:FormGroup,
    applicationDetail,
    accountDetail
  ): boolean {
     this.applicationDetails = applicationDetail;
    this.accountDetails = accountDetail;
    let showInput = true
if(isDependent){
    // console.log('getting Input',input)
    // console.log('getting isDependent',isDependent)
    // console.log('getting controlName',controlName)
    // console.log('getting parentValue',parentValue)
    // console.log('getting formGroup',formGroup)
    // console.log(this)
    showInput = input.showIfParentValue.findIndex(correctVal=>{
      // console.log(correctVal,parentValue)
       return correctVal === parentValue
    }) > -1 
    // console.log(showInput);
    if(!showInput){
        formGroup.removeControl(controlName)
    } else {
        if(!formGroup.get(controlName)){
        let validators = this.getValidator(input.validators)
            let nestedTag
            if (input.valueTag.length>0) {
                //get the nestedValue
                nestedTag = this[input.valueTag[0]];
                input.valueTag.forEach((val,index)=>{
                  if(index!==0) {
                    // console.log(val)
                    nestedTag = nestedTag[val]};
                    
                })
                console.log(nestedTag)
                formGroup.addControl(input.controlName, new FormControl(nestedTag[input.key], validators))
               
              } else if(input.defaultValue){
                formGroup.addControl(input.controlName, new FormControl(input.defaultValue, validators))
                
              }else {
                formGroup.addControl(input.controlName, new FormControl(input.value, validators))
        
              }
              if(input.disable){
                formGroup.get(input.controlName).disable();
              }
        }
    }
    return showInput
}
 return showInput;
}
getValidator(validator) {
    let validators = Object.keys(validator).map(key=>{
      if (key === 'required') {
        return Validators.required
      } else if (key === 'pattern'){
        return Validators.pattern(validator[key])
      } else if(key==='minLength') {
        return Validators.minLength(validator[key])
      } else if(key==='maxLength') {
        return Validators.maxLength(validator[key])
      }
    })
    return validators
  }
}
