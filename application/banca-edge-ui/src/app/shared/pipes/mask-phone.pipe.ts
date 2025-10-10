import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPhone',
})
export class MaskPhonePipe implements PipeTransform {
  transform(cardNumber, visibleDigits, isInsurer): string {
    if (isInsurer == true) {
      //show first and last digits based on given input
      let firstVisibleNumbers = cardNumber.slice(0, visibleDigits);
      let maskedNumbers = cardNumber.slice(visibleDigits, -visibleDigits);
      let lastVisibleNumbers = cardNumber.slice(-visibleDigits);
      return firstVisibleNumbers + maskedNumbers.replace(/./g, '*') + lastVisibleNumbers;
    } else {
      return cardNumber;
    }
  }
}
