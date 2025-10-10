import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'getDate' })
export class GetDatePipe implements PipeTransform {
  transform(dateToBeCreated, insuredData): Date {
    if (dateToBeCreated && dateToBeCreated.length > 0) {
      const date = dateToBeCreated.split(' ');
      const futureDate = date.slice(-1)[0] === 'add';
      if (futureDate) {
        date.pop();
      }
      if (futureDate && date.length >= 3) {
        const tag = date.pop();
        let requiredLevel = insuredData;
        date.slice(2).forEach((key) => {
          requiredLevel = requiredLevel[key];
        });
        date[0] = +date[0] + requiredLevel[tag];
        dateToBeCreated = date.join(' ');
        const requiredDate = dateToBeCreated.split(' ');
        const today = moment().add(Number(requiredDate[0]), requiredDate[1]);
        return new Date(today.toDate());
      } else if (futureDate) {
        const requiredDate = dateToBeCreated.split(' ');
        const today = moment().add(Number(requiredDate[0]), requiredDate[1]);
        return new Date(today.toDate());
      } else if (date.length >= 3) {
        const tag = date.pop();
        let requiredLevel = insuredData;
        date.slice(2).forEach((key) => {
          requiredLevel = requiredLevel[key];
        });
        date[0] = +date[0] + requiredLevel[tag];
        dateToBeCreated = date.join(' ');
        const requiredDate = dateToBeCreated.split(' ');
        const today = moment().subtract(Number(requiredDate[0]), requiredDate[1]);
        return new Date(today.toDate());
      } else {
        const requiredDate = dateToBeCreated.split(' ');
        const today = moment().subtract(Number(requiredDate[0]), requiredDate[1]);
        return new Date(today.toDate());
      }
    }
  }
}
