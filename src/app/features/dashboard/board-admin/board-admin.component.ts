import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SubSink} from 'subsink';
import {MatTableDataSource} from '@angular/material/table';
import {UserService} from '../../../shared/_services/user.service';

@Component({
    selector: 'app-board-admin',
    templateUrl: './board-admin.component.html',
    styleUrls: ['./board-admin.component.scss']
})

export class BoardAdminComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) private paginator: MatPaginator | any;
    @ViewChild(MatSort) private sort: MatSort | undefined;

    private subs: SubSink = new SubSink();
    private roles: string[] = [];
    public users: any;
    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns: string[] = ['id', 'fullName', 'roles'];
    public showAdminBoard: boolean = false;
    public isLoading: boolean = true;
    public content: string = '';
    public noDataMsg: string = '';

    public constructor(private token: TokenStorageService,
                       private userService: UserService,
                       private router: Router) {
    }

    public ngOnInit(): void {
        // this.isLoading = true;
        const user = this.token.getUser();
        this.roles = user.roles;

        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

        if (!this.showAdminBoard) {
            this.router.navigate(['home']).then();
        }

        this.content = 'Користувачі';
        this.noDataMsg = 'Немає даних';
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

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource<any>();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.getAndSetUserItems();
        })
        // if (this.dataSource?.data.length > 0) {
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        // }
    }

    public getAndSetUserItems(): void {
        this.isLoading = true;
        this.subs.add(
            this.userService.getAll().subscribe((data: any) => {
                this.dataSource = new MatTableDataSource<any>(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isLoading = false;
            }, () => {
                this.content = '🤷‍♀️ Щось пішло не так, спробуйте пізніше!';
                this.isLoading = false;
            })
        );
    }
}
