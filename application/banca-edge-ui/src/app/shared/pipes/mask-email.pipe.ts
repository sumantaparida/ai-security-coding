import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskEmail',
})
export class MaskEmailPipe implements PipeTransform {
  transform(email, isInsurer) {
    if (isInsurer == true) {
      email = email.split('');
      let finalArray = [];
      let length = email.indexOf('@') - 2;
      console.log('Hello', length);
      email.forEach((item, pos) => {
        console.log('item', item);
        console.log('POS', pos);
        pos >= 2 && pos <= length - 1 ? finalArray.push('*') : finalArray.push(email[pos]);
      });
      return finalArray.join('');
    } else {
      return email;
    }
  }
}
