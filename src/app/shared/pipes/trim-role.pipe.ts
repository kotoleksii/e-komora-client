import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'trimRole'
})
export class TrimRolePipe implements PipeTransform {

    public transform(role: string): string {
        if (!role) {
            return '';
        }
        return role.replace('ROLE_', '');
    }

}
