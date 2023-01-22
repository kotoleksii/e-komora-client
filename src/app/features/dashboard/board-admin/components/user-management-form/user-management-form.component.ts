import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from '../../../../../shared/_services/token-storage.service';
import {SubSink} from 'subsink';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {first} from 'rxjs/operators';
import {UserService} from '../../../../../shared/_services/user.service';
import {IRole} from 'src/app/shared/interfaces/role';
import {IUser} from 'src/app/shared/interfaces/user';

@Component({
    selector: 'app-user-management-form',
    templateUrl: './user-management-form.component.html',
    styleUrls: ['./user-management-form.component.scss']
})
export class UserManagementFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public user: any;
    // public userId: number = 0;
    public roles: any[] = [];
    public isLoading: boolean = true;
    public showAdminBoard: boolean = false;
    public isDataChanged: boolean = false;
    public userForm: any;
    public selectedRoles: IRole[] = <IRole[]> {};
    public availableRoles: IRole[] = [
        {id: 1, name: 'ROLE_EMPLOYEE'},
        {id: 2, name: 'ROLE_HR'},
        {id: 3, name: 'ROLE_ACCOUNTANT'},
        {id: 4, name: 'ROLE_NEWS_MAKER'},
        {id: 5, name: 'ROLE_ADMIN'}
    ];

    public constructor(private token: TokenStorageService,
                       private userService: UserService,
                       private fb: FormBuilder,
                       private route: ActivatedRoute,
                       private router: Router) {
    }

    public ngOnInit(): void {
        const userId = this.route.snapshot.params.id;

        const user = this.token.getUser() as IUser;
        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

        if (!this.showAdminBoard) {
            this.router.navigate(['home']).then();
        }

        this.userForm = this.fb.group({
            roles: new FormArray([])
        });

        this.getUserById(userId);
    }

    public getUserById(id: number): void {
        this.isLoading = true;
        this.subs.add(
            this.userService.getById(id)
                .pipe(first())
                .subscribe((res) => {
                    this.user = res;
                    this.isLoading = false;
                    // console.log(this.user);
                    this.selectedRoles = this.user.roles;
                }, () => {
                    this.isLoading = false;
                })
        );
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public addRoleControl(roleId: number): FormControl {
        return this.fb.control(this.isRoleSelected(roleId));
    }

    public isRoleSelected(roleId: number): boolean {
        return this.user?.roles.find((role: IRole) => role.id === roleId);
    }

    public onRoleChange(role: IRole, event: any): void {
        this.isDataChanged = true;
        if (event.target.checked) {
            this.user?.roles.push(role);
            // console.log(this.user.roles);
        } else {
            this.user.roles = this.user?.roles.filter((r: IRole) => r.id !== role.id);
        }
    }

    public onSubmit(): void {
        const selectedRoleIds = this.availableRoles
            .filter((role: IRole) => this.user?.roles.find((r: IRole) => r.id === role.id))
            .map((role: IRole) => role);
        // console.log(selectedRoleIds);

        this.subs.add(
            this.userService.updateRoles(this.user.id, selectedRoleIds)
                .subscribe(() => {
                    // this.user.roles = this.availableRoles.filter((role: any) => selectedRoleIds.includes(role.id));
                    this.user.roles = selectedRoleIds;
                    this.router.navigate(['dashboard/admin']).then();
                }, () => {
                }));
    }
}
