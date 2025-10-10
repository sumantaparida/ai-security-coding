import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Pipe({
    name: 'spDropDown'
})
export class SPDROPDOWN implements PipeTransform {

    transform(reqInsurer: any[],selectedInsurer:string,FormGroup):boolean {
            if(reqInsurer.findIndex(insurer=>{return insurer === selectedInsurer})>-1) {
                console.log('HI')
                FormGroup.addControl('spCode',new FormControl('',Validators.required))
                return true
            }else {
                FormGroup.removeControl('spCode');
                return false;
            };
    }

}
