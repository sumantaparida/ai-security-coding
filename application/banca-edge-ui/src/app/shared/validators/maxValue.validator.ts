import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxvalueVal(val: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        // console.log(control,val);
        if (isNaN(control.value)) {
            return null;
        }

        if (control.value > val) {
            return { 'maxvalueVal': true, 'maxvalue': val }
        }

        return null;

    }

}