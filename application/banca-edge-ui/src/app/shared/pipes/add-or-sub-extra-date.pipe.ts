import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'addOrSubExtraDate',
})
export class AddOrSubExtraDatePipe implements PipeTransform {
  transform(currentDate, additionalDateInfo): Date {
    if (
      additionalDateInfo &&
      additionalDateInfo.length > 0 &&
      additionalDateInfo.split(' ').length >= 2
    ) {
      const date = additionalDateInfo.split(' ');
      const futureDate = date.slice(-1)[0] === 'add';
      if (futureDate) {
        date.pop();
      }
      if (futureDate) {
        const requiredDate = additionalDateInfo.split(' ');
        return moment(currentDate).add(Number(requiredDate[0]), requiredDate[1]).toDate();
      } else {
        const requiredDate = additionalDateInfo.split(' ');
        return moment(currentDate).subtract(Number(requiredDate[0]), requiredDate[1]).toDate();
      }
    } else {
      return currentDate;
    }
  }
}
