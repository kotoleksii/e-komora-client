import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {TestService} from '../../../shared/_services/test.service';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MaterialService} from '../../../shared/_services/material.service';
import {IUser} from '../../../shared/interfaces/user';
import {map, reduce, switchMap} from 'rxjs/operators';
import {combineLatest, forkJoin, merge, Observable, pipe} from 'rxjs';
import {FormControl} from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-board-accountant',
    templateUrl: './board-accountant.component.html',
    styleUrls: ['./board-accountant.component.scss']
})
export class BoardAccountantComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;

    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns = ['id', 'title', 'inventoryNumber', 'dateStart', 'type', 'userId', 'lastName', 'ID'];
    materials?: any;
    users?: any;
    userId: number = 0;
    content?: string;
    showAccountantBoard = false;
    private roles: string[] = [];
    private subs: SubSink = new SubSink();
    employeesForm = new FormControl('');

    constructor(private userService: UserService,
                private testService: TestService,
                private token: TokenStorageService,
                private materialService: MaterialService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.content = 'Матеріальні цінності';
        const user = this.token.getUser();
        this.roles = user.roles;
        this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');

        if (!this.showAccountantBoard) {
            this.router.navigate(['home']).then();
        }

        // this.getAndSetMaterials();
        this.getEmployeeItems();
        this.merge();
    }

    public getAndSetMaterials(): void {
        this.subs.add(
            this.materialService.getAll().subscribe((data: any) => {
                this.materials = data;
                console.log(this.materials);
                this.dataSource = new MatTableDataSource<any>(this.materials);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }));
    }

    merge(): void {
        let observable = forkJoin([
            this.materialService.getAll(),
            this.userService.getAll()
        ]).pipe(map(([materials, users]) => materials.map(material => {
                return {
                    'id': material.id,
                    'title': material.title,
                    'inventoryNumber': material.inventoryNumber,
                    'dateStart': material.dateStart,
                    'type': material.type,
                    'userId': material.userId,
                    'lastName': users.find((x: any) => x.id === material.userId).lastName
                };
            })
        )).subscribe((res) => {
            this.materials = res;
            console.log(this.materials);
            this.dataSource = new MatTableDataSource<any>(this.materials);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    public getEmployeeItems(): void {
        this.userService.getAll().subscribe((res: IUser[]) => {
            this.users = res;
        });
    }

    public getEmployeeById(id: number): string {
        return this.users?.find((el: any) => el.id === id).lastName;
    }

    getAccountantServerText(): void {
        this.subs.add(
            this.testService.getAccountantBoard().subscribe(
                data => {
                    this.content = data;
                    console.log(this.content);
                },
                err => {
                    this.content = err?.message;
                }
            ));
    }

    onChange(event: any): void {
        if (event.value === 'не обрано') {
            console.log(this.materials);
            this.dataSource = new MatTableDataSource<any>(this.materials);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }else {
            let filteredData = _.filter(this.materials, (item) => {
                return item.userId === event.value;
            });
            this.dataSource = new MatTableDataSource<any>(filteredData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
