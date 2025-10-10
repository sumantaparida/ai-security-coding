import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getAltVal',
})
export class GetAlternateValue implements PipeTransform {
  transform(
    actualValue:any,
    detailForm: any,
    getValFrom: any,
  ): string {
        if(detailForm.getDiffVAl){
          const getval = getValFrom.find(val=>{return val.id == actualValue })
        return getval.name ? getval.name : getval.value
        } else {
            if(detailForm.key==="insureds"){
            }
            return actualValue;
        }
  }

  
}