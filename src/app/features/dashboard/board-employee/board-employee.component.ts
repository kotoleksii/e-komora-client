import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {MaterialService} from '../../../shared/_services/material.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {TestService} from '../../../shared/_services/test.service';
import {TableService} from '../../../shared/_services/table.service';
import {IMaterial} from '../../../shared/interfaces/material';

@Component({
    selector: 'app-board-employee',
    templateUrl: './board-employee.component.html',
    styleUrls: ['./board-employee.component.scss']
})
export class BoardEmployeeComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) private paginator: MatPaginator | any;
    @ViewChild(MatSort) private sort: MatSort | undefined;
    private roles: string[] = [];
    private subs: SubSink = new SubSink();

    public dataSource: MatTableDataSource<any> | any;
    public displayedColumns = ['ID', 'title', 'inventoryNumber', 'dateStart', 'type', 'amount'];
    public currentUserId: any;
    public content: string = '';
    public materials?: any;
    public showEmployeeBoard = false;

    public constructor(private token: TokenStorageService,
                       private userService: UserService,
                       private testService: TestService,
                       private tableService: TableService,
                       private materialService: MaterialService) {
    }

    public ngOnInit(): void {
        this.content = 'Мої матеріали';
        const user = this.token.getUser();
        this.roles = user.roles;
        this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');

        this.currentUserId = user.id;
        this.getAndSetMaterialItems();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public getAndSetMaterialItems(): void {
        this.subs.add(
            this.materialService.getByUserId(this.currentUserId).subscribe((data: any) => {
                this.dataSource = new MatTableDataSource<any>(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }));
    }

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public exportAsPdf(): void {
        // TODO
        this.tableService.exportAsPdf('table', this.content);
    }

    public exportAsExcel(): void {
        this.tableService.exportAsExcel(this.tableDataToExport(), this.content);
    }

    public exportAsCsv(): void {
        this.tableService.exportAsCsv(this.tableDataToExport(), this.content);
    }

    private tableDataToExport(): any {
        let tableData = this.dataSource.data;
        tableData = tableData.map((element: IMaterial) => ({
            ID: element.id,
            Найменування: element.title,
            Інвентарний: element.inventoryNumber,
            Дата: element.dateStart,
            Тип: element.type,
            Кількість: element.amount,
            Ціна: element.price
        }));
        return tableData;
    }

    private getEmployeeServerText(): void {
        this.subs.add(
            this.testService.getEmployeeBoard().subscribe(
                (data) => {
                    this.content = data;
                },
                (err: Error) => {
                    this.content = err?.message;
                }
            ));
    }
}
