import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relationshipFilter' })
export class RelationshipFilterPipe implements PipeTransform {

    transform(relationshipDropdown: any[], relationshipId): any[] {
        return relationshipDropdown.find(rel => rel.id === relationshipId)?.value;
    }

}
