import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {IMaterial} from '../../../shared/interfaces/material';
import {MatDialog} from '@angular/material/dialog';
import {QrReaderModalComponent} from '../../../shared/modals/qr-reader-modal/qr-reader-modal.component';

@Component({
    selector: 'app-board-accountant',
    templateUrl: './board-accountant.component.html',
    styleUrls: ['./board-accountant.component.scss']
})
export class BoardAccountantComponent implements OnInit, OnDestroy {
    @ViewChild('filter') private filterField: ElementRef<HTMLInputElement> = {} as ElementRef<HTMLInputElement>;
    @ViewChild(MatPaginator) private paginator: MatPaginator | any;
    @ViewChild(MatSort) private sort: MatSort | undefined;

    private roles: string[] = [];
    private subs: SubSink = new SubSink();

    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns: string[] = ['id', 'title', 'inventoryNumber', 'dateStart', 'type', 'amount', 'price',
        'userId', 'lastName', 'ID'];
    public materials: IMaterial | any;
    public users: IUser | any;
    public userId: number = 0;
    public content?: string;
    public showAccountantBoard: boolean = false;
    public qrReadData: any;

    public constructor(private userService: UserService,
                       private testService: TestService,
                       private materialService: MaterialService,
                       private token: TokenStorageService,
                       public dialog: MatDialog,
                       private router: Router) {
    }

    public ngOnInit(): void {
        this.content = 'Матеріальні цінності';
        const user = this.token.getUser();
        // console.log(user);
        this.roles = user.roles;
        this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');

        if (!this.showAccountantBoard) {
            this.router.navigate(['home']).then();
        }

        this.getEmployeeItems();
        this.getAndSetMaterialsWithUsers();
    }

    public openQrReaderModal(): void {
        const dialogRef = this.dialog.open(QrReaderModalComponent, {
            width: '350px',
            data: {qrReadData: this.qrReadData}
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            this.qrReadData = dialogResult;
            // console.log(this.qrReadData);
            if (this.qrReadData !== undefined) {
                this.filterField.nativeElement.focus();
                this.filterField.nativeElement.value = this.qrReadData;
                let keyUpEvent = new KeyboardEvent('keyup', {bubbles: true});
                this.filterField.nativeElement.dispatchEvent(keyUpEvent);
            }
            this.qrReadData = '';
        });
    }

    public onChange(event: any): void {
        const filterValue = event.value;
        if (filterValue === 'не обрано') {
            this.initDataTable(this.materials);
        } else {
            const filteredData = this.materials.filter((item: IMaterial) => {
                return item.userId === filterValue;
            });
            this.dataSource = new MatTableDataSource<IMaterial>(filteredData);
            this.dataSource.sort = this.sort;

            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        }
    }

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public getAccountantServerText(): void {
        this.subs.add(
            this.testService.getAccountantBoard().subscribe(
                (data) => {
                    this.content = data;
                    // console.log(this.content);
                },
                (err: Error) => {
                    this.content = err?.message;
                }
            ));
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    private getAndSetMaterialsWithUsers(): void {
        this.subs.add(forkJoin([
            this.materialService.getAll(),
            this.userService.getAll()
        ]).pipe(map(([materials, users]) => materials.map((material) => {
                return {
                    id: material.id,
                    title: material.title,
                    inventoryNumber: material.inventoryNumber,
                    dateStart: material.dateStart,
                    type: material.type,
                    amount: material.amount,
                    price: material.price,
                    userId: material.userId,
                    lastName: users.find((x: IUser) => x.id === material.userId).lastName
                };
            })
        )).subscribe((data: IMaterial[]) => {
            this.initDataTable(data);
        }));
    }

    private initDataTable(data: IMaterial[]): void {
        this.materials = data;
        this.dataSource = new MatTableDataSource<IMaterial>(this.materials);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private getEmployeeItems(): void {
        this.subs.add(
            this.userService.getAll().subscribe((res: IUser[]) => {
                this.users = res;
            }));
    }
}
