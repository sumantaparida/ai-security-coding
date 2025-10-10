import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function multiplesVal(val: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // console.log(control,val);
    if (isNaN(control.value)) {
      return null;
    }

    if (control.value % val !== 0) {
      return { multiplesVal: true, multiples: val };
    }

    return null;
  };
}
