import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';

@Pipe({
  name: 'displayPolicyOptions',
})
export class DisplayPolicyOptionsPipe implements PipeTransform {
  transform(
  parentFormValue,
   dependsOnControl,
   formGroup,
   policyOption
  ): boolean {
    if (dependsOnControl) {
      console.log('in DisplayFormFieldPipe formGroup', formGroup);
      console.log('in DisplayFormFieldPipe policyOption', policyOption);
      console.log('in DisplayFormFieldPipe parentFormValue', parentFormValue);
    }

    let shouldFormBeVisible = false;
    if (dependsOnControl) {
      console.log('yo',parentFormValue)
      if(policyOption.fieldVisibleIfVal.includes(parentFormValue)){
      console.log('yo1',parentFormValue)
      shouldFormBeVisible = true;
     }
    } else {
      shouldFormBeVisible = true;
    }
    // console.log('finally checking the answer', shouldFormBeVisible, formGroup);
    return shouldFormBeVisible;
  }

  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(Validators.minLength(formData.validators.minLength));
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (validatorKey === 'email' && formData.validators[validatorKey]) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      } else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(formData.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }
}
