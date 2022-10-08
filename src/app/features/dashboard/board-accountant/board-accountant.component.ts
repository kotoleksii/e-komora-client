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
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-board-accountant',
    templateUrl: './board-accountant.component.html',
    styleUrls: ['./board-accountant.component.scss']
})
export class BoardAccountantComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) private paginator: MatPaginator | any;
    @ViewChild(MatSort) private sort: MatSort | undefined;

    private roles: string[] = [];
    private subs: SubSink = new SubSink();

    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns = ['id', 'title', 'inventoryNumber', 'dateStart', 'type', 'userId', 'lastName', 'ID'];
    public materials?: any;
    public users?: any;
    public userId: number = 0;
    public content?: string;
    public showAccountantBoard = false;

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

        this.getEmployeeItems();
        this.getAndSetMaterialsWithUsers();
    }

    getAndSetMaterialsWithUsers(): void {
        this.subs.add(forkJoin([
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
        )).subscribe((data) => {
            this.initDataTable(data);
        }));
    }

    private initDataTable(data: any): void {
        this.materials = data;
        this.dataSource = new MatTableDataSource<any>(this.materials);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public getAndSetMaterials(): void {
        this.subs.add(
            this.materialService.getAll().subscribe((data: any) => {
                this.initDataTable(data);
            }));
    }

    public getEmployeeItems(): void {
        this.subs.add(
            this.userService.getAll().subscribe((res: IUser[]) => {
                this.users = res;
            }));
    }

    onChange(event: any): void {
        const filterValue = event.value;
        if (filterValue === 'не обрано') {
            this.initDataTable(this.materials);
        } else {
            const filteredData = this.materials.filter((item: any) => {
                return item.userId === filterValue;
            });
            this.dataSource = new MatTableDataSource<any>(filteredData);
            this.dataSource.sort = this.sort;

            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
