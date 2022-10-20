import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from 'angular-notifier';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {TestService} from '../../../shared/_services/test.service';

@Component({
    selector: 'app-board-hr',
    templateUrl: './board-hr.component.html',
    styleUrls: ['./board-hr.component.scss']
})
export class BoardHrComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) private paginator: MatPaginator | any;
    @ViewChild(MatSort) private sort: MatSort | undefined;

    private subs: SubSink = new SubSink();
    private roles: string[] = [];

    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns: string[] = ['avatar', 'ID', 'fullName', 'post'];
    public users: any;
    public showHRBoard: boolean = false;
    public imageWidth: number = 30;
    public imageMargin: number = 2;
    public showImage: boolean = false;
    public content?: string;

    public constructor(private userService: UserService,
                       private testService: TestService,
                       private notifierService: NotifierService,
                       private token: TokenStorageService) {
    }

    public ngOnInit(): void {
        const user = this.token.getUser();
        this.roles = user.roles;
        this.showHRBoard = this.roles.includes('ROLE_HR');

        this.content = 'Картки';
        this.getAndSetUserItems();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public getAndSetUserItems(): void {
        this.subs.add(
            this.userService.getAll().subscribe((data: any) => {
                this.dataSource = new MatTableDataSource<any>(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                // this.notifierService.notify('success', `💪 Дані оновлено!`);
            }));
    }

    private getHRServerText(): void {
        this.subs.add(
            this.testService.getHRBoard().subscribe(
                (data) => {
                    this.content = data;
                },
                (err) => {
                    this.content = err?.message;
                }
            ));
    }
}
