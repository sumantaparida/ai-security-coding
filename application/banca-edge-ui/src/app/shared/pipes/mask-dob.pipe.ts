import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskDob',
})
export class MaskDobPipe implements PipeTransform {
  transform(dob, isInsurer): string {
    if (isInsurer == true) {
      const visibleDigits = 4;
      let maskedNumbers = dob.slice(visibleDigits);
      return maskedNumbers.replace(/./g, '*');
    } else {
      return dob;
    }
  }
}
