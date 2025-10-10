import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showFilter' })
export class ShowFilter implements PipeTransform {
    transform(user, formGroup, form, parentVal): boolean {
        if (form.hasCondition) {
            if (form.condition.type === 'role') {
                return user.userGroups.includes(form.condition.value)
            } else if (form.condition.type === 'fieldDependent') {
                return form.condition.value.includes(parentVal)
            }
        } else {
            return true
        }
    }
}



