import { CompilerConfig } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';

@Pipe({ name: 'displayQuestion' })
export class DisplayQuestionPipe implements PipeTransform {
    transform(input, formValue, form: FormGroup, quoteInput, backtoQuestion) {
        // console.log(input, 'contol name', 'gtepop', formValue);
        form.get('sa')?.setValue(formValue?.area * formValue?.costofConstruction);
        if (!input?.isDependant) {
            return true;
        } else {
            const controlName = input?.dependsOnConrtol;
            // console.log('control.name', controlName, formValue[controlName], input?.dependsOnValue);
            if (input?.dependsOnValue.findIndex(val => val === form.getRawValue()[controlName]) > -1) {
                // console.log(form.getRawValue()[controlName]);
                const validators = this.getValidatorsArray(input);
                if (backtoQuestion) {
                    if (input.hasOwnProperty('key')) {
                        const key = input?.key
                        if (Array.isArray(quoteInput[key]) && quoteInput[key].length > 0) {
                            quoteInput[key].forEach(content => {
                                if (content.type === input.ofvalueType) {
                                    if (input.controlType === 'radio') {
                                        form.addControl(input?.controlName, new FormControl('yes', validators))
                                    }
                                    form.addControl(input?.controlName, new FormControl(content.sa, validators))
                                }
                            });
                            if (input.controlType === 'radio') {
                                form.addControl(input?.controlName, new FormControl('no', validators))
                            }
                        }
                        form.addControl(input?.controlName, new FormControl(quoteInput[key][input?.controlName], validators));
                    }
                    console.log(form)
                }

                else {
                    if (input?.controlName === 'CONT') {
                        form.addControl(input?.controlName, new FormControl('yes', validators));
                        form.controls[input?.controlName].disable();

                    }
                    else {
                        form.addControl(input?.controlName, new FormControl('', validators));
                    }
                }
                return true;

            } else {
                form.removeControl(input?.controlName);
                return false;
            }

        }
    }

    getValidatorsArray(input): any[] {
        const validatorsArray = [];
        Object.keys(input.validators).forEach(validatorKey => {
            if (validatorKey === 'required') {
                validatorsArray.push(Validators.required);
            } else if (validatorKey === 'minLength') {
                validatorsArray.push(Validators.minLength(input?.validators.minLength));
            } else if (validatorKey === 'maxLength') {
                validatorsArray.push(Validators.maxLength(input?.validators.maxLength));
            } else if (validatorKey === 'min') {
                validatorsArray.push(Validators.min(input?.validators.min));
            } else if (validatorKey === 'max') {
                validatorsArray.push(Validators.max(input?.validators.max));
            } else if (validatorKey === 'email' && input?.validators[validatorKey]) {
                validatorsArray.push(Validators.email);
            } else if (validatorKey === 'pattern') {
                validatorsArray.push(Validators.pattern(input?.validators.pattern));
            }
            else if (validatorKey === 'maxValue'){
                validatorsArray.push(maxvalueVal(input.validators.maxValue));
              }
        });
        return validatorsArray;
    }
}
