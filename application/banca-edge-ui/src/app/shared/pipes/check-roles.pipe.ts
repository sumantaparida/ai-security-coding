import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkRoles',
})
export class CheckRolesPipe implements PipeTransform {
  transform(navRoles, userRoles): boolean {
    if (!navRoles || navRoles.length === 0) return true;
    const roles = userRoles.filter((userRole) => navRoles.indexOf(userRole) > -1);
    // console.log('roles', roles);
    return roles.length > 0 ? true : false;
  }
}
