import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskName',
})
export class MaskNamePipe implements PipeTransform {
  transform(name: any, isInsurer) {
    console.log('Name', name, isInsurer);
    if (isInsurer == true) {
      let finalArray = [];
      let length = name.length - 2;

      // const visibleDigits = 2;
      // let visibleNumbers = name.slice(0, visibleDigits);
      // let maskedNumbers = name.slice(visibleDigits);
      // return visibleNumbers + maskedNumbers.replace(/./g, '*');
      name = name.split('');
      name.forEach((item, pos) => {
        console.log('Item', item);
        console.log('Pos', pos);
        pos >= 2 && pos <= length - 1 ? finalArray.push('*') : finalArray.push(name[pos]);
      });
      return finalArray.join('');
    } else {
      return name;
    }
  }
}
