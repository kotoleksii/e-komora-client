import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {MaterialService} from '../../../shared/_services/material.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {TestService} from '../../../shared/_services/test.service';

@Component({
  selector: 'app-board-employee',
  templateUrl: './board-employee.component.html',
  styleUrls: ['./board-employee.component.scss']
})
export class BoardEmployeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;

  public dataSource: MatTableDataSource<any> | any;
  public displayedColumns = ['ID', 'title', 'inventoryNumber', 'dateStart', 'type'];
  currentUserId: any;
  content?: string;
  materials?: any;
  showEmployeeBoard = false;
  private roles: string[] = [];
  private subs: SubSink = new SubSink();

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private testService: TestService,
              private materialService: MaterialService) {
  }

  ngOnInit(): void {
    this.content = 'Мої матеріали';
    const user = this.token.getUser();
    this.roles = user.roles;
    this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');

    this.currentUserId = user.id;
    this.getAndSetMaterialItems();
  }

  public getAndSetMaterialItems(): void {
    this.subs.add(
      this.materialService.getByUserId(this.currentUserId).subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
  }

  getEmployeeServerText(): void {
    this.subs.add(
      this.testService.getEmployeeBoard().subscribe(
        data => {
          this.content = data;
        },
        err => {
          this.content = err?.message;
        }
      ));
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
