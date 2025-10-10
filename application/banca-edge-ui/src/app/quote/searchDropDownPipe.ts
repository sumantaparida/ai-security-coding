import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchDropDown'
})
export class SearchDropDownPipe implements PipeTransform {

    transform(arr: any[], searchText: string) {
        if (!arr) {
            return [];
        }
        if (!searchText) {
            return arr;
        }
        searchText = searchText.toLowerCase();
        return arr.filter((item: any) => {
            if (typeof item.value === 'string') {
                return item.value.toLowerCase().indexOf(searchText) > -1;
            } else if (typeof item.value === 'number') {
                return item.value.toString().toLowerCase().indexOf(searchText) > -1;
            }

        });
    }

}
