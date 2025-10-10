import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Pipe({
  name: 'displayFormField',
})
export class DisplayFormFieldPipe implements PipeTransform {
  transform(
    formData: any[],
    dependsOnControl,
    formGroup: FormGroup,
    parentFormValue,
    object
  ): boolean {
    if (dependsOnControl) {
      // console.log('in DisplayFormFieldPipe formData', formData);
      // console.log('in DisplayFormFieldPipe dependsOnControl', dependsOnControl);
      // console.log('in DisplayFormFieldPipe formGroup', formGroup);
      // console.log('in DisplayFormFieldPipe parentFormValue', parentFormValue);
    }

    let shouldFormBeVisible = false;
    let currentKey = '';
    if (dependsOnControl) {
      const dependentFields = formData.find(
        (form) => form.dependentFieldControlName === dependsOnControl
      );
      // console.log('got dependent form field', dependentFields);
      currentKey = dependentFields.key !== '' ? '-' + dependentFields.key : '';

      shouldFormBeVisible =
        dependentFields.fieldVisibleIfValueIn.findIndex(
          (value) => value === parentFormValue
        ) > -1;
      if (shouldFormBeVisible) {
        const validators = this.getValidatorsArray(dependentFields);
        if (dependentFields.key !== '') {
          formGroup.addControl(
            dependentFields.controlName + currentKey,
            new FormControl(
              object[dependentFields.key][dependentFields.valueType],
              validators
            )
          );
        } else {
          formGroup.addControl(
            dependentFields.controlName + currentKey,
            new FormControl(object[dependentFields.valueType], validators)
          );
        }
      } else {
        formGroup.removeControl(dependentFields.controlName + currentKey);
        if (dependentFields.key !== '') {
          object[dependentFields.key][dependentFields.valueType] = '';
        } else {
          object[dependentFields.valueType] = '';
        }
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
        validatorsArray.push(
          Validators.minLength(formData.validators.minLength)
        );
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(
          Validators.maxLength(formData.validators.maxLength)
        );
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (
        validatorKey === 'email' &&
        formData.validators[validatorKey]
      ) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      }
    });
    return validatorsArray;
  }
}
