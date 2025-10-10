import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Pipe({ name: 'displayForm' })
export class DisplayFormPipe implements PipeTransform {
    transform(currentForm, allForm, formValue, formGroup: FormGroup): boolean {
        if (currentForm.isDependent) {
            const dependentForm = allForm.filter(form => form.dependsOnControl === currentForm.dependsOnControl);
            if (dependentForm && dependentForm.length > 0) {
                dependentForm.forEach(dependentForm1 => {
                    if (dependentForm1.sectionVisibleIfDependentValueIn
                        .findIndex(value => value === formGroup.get(dependentForm1.dependsOnControl).value) > -1) {
                        const validators = this.getValidatorsArray(dependentForm1);
                        formGroup.addControl(dependentForm1.controlName, new FormControl('', validators));
                    } else {
                        if (formGroup.get(dependentForm1.controlName) !== null) {
                            formGroup.removeControl(dependentForm1.controlName);
                        }

                    }

                });
            }
        }
        return !currentForm.isDependent || (currentForm.isDependent &&
            currentForm.sectionVisibleIfDependentValueIn.findIndex(value => value === formValue) > -1);
    }



    getValidatorsArray(formData): any[] {
        const validatorsArray = [];
        Object.keys(formData.validators).forEach(validatorKey => {
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
            }
        });
        return validatorsArray;
    }
}



