import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getEmail'
})
export class GetEmailPipe implements PipeTransform {

  transform(contactList: any[]): string {
    if (contactList) {
      return contactList.find(contact => contact.contactType.toLowerCase() === 'email')?.contactText;
    } else {
      return '';
    }
  }

}
