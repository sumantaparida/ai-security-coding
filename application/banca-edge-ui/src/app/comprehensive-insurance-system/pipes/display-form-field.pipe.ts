import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';

@Pipe({
  name: 'displayFormField',
})
export class DisplayFormFieldPipe implements PipeTransform {
  transform(
    formData: any[],
    dependsOnControl,
    currentControl,
    formGroup: FormGroup,
    parentFormValue,
    object,
  ): boolean {
    if (dependsOnControl) {
      // console.log('in DisplayFormFieldPipe formData', formData);
      // console.log('in DisplayFormFieldPipe dependsOnControl', dependsOnControl);
      // console.log('in DisplayFormFieldPipe currentControl', currentControl);
      // console.log('in DisplayFormFieldPipe formGroup', formGroup);
      // console.log('in DisplayFormFieldPipe parentFormValue', parentFormValue);
      // console.log('in DisplayFormFieldPipe object', object);
    }

    let shouldFormBeVisible = false;
    let currentKey = '';
    if (dependsOnControl) {
      const dependentFields = formData.find(
        (form) =>
          form.dependentFieldControlName === dependsOnControl &&
          form.controlName === currentControl.split('-')[0],
      );
      // console.log('got dependent form field', dependentFields);
      currentKey = dependentFields.key !== '' ? '-' + dependentFields.key : '';

      shouldFormBeVisible =
        dependentFields.fieldVisibleIfValueIn.findIndex((value) => {
          // console.log('value', value, 'type', typeof value);
          if (typeof value === 'object') {
            if (value.hasOwnProperty('ageBelow')) {
              let dob = new Date(parentFormValue);
              let monthDiff = Date.now() - dob.getTime();
              let ageDt = new Date(monthDiff);
              let year = ageDt.getUTCFullYear();
              let age = Math.abs(year - 1970);
              return age < value['ageBelow'];
            }
          } else if (typeof value === 'boolean') {
            return value === parentFormValue;
          } else {
            return value === parentFormValue;
          }
        }) > -1;
      if (shouldFormBeVisible) {
        const validators = this.getValidatorsArray(dependentFields);
        if (dependentFields.key !== '') {
          formGroup.addControl(
            dependentFields.controlName + currentKey,
            new FormControl(object[dependentFields.key][dependentFields.valueType], validators),
          );
        } else {
          formGroup.addControl(
            dependentFields.controlName + currentKey,
            new FormControl(object[dependentFields.valueType], validators),
          );
        }
        if (dependentFields.initiallyDisabled) {
          formGroup.get(dependentFields.controlName + currentKey).disable();
        }
      } else {
        // console.log('removing control', dependentFields.controlName + currentKey);
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
