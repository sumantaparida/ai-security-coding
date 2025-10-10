import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDropDown',
})
export class SearchDropDownPipe implements PipeTransform {
  transform(arr: any[], searchText: string, searchName: string) {
    console.log('pipe arr', arr,'text =',searchText,'name=',searchName);
    if (!arr) {
      return [];
    }
    if (!searchText) {
      return arr;
    }
    searchText = searchText.toLowerCase();
    return arr.filter((item: any) => {
      if (typeof item[searchName] === 'string') {
        return item[searchName].toLowerCase().indexOf(searchText) > -1;
      } else if (typeof item[searchName] === 'number') {
        return item[searchName].toString().toLowerCase().indexOf(searchText) > -1;
      }
    });
  }
}
