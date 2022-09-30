import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {MaterialService} from '../../../shared/_services/material.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';

@Component({
  selector: 'app-board-employee',
  templateUrl: './board-employee.component.html',
  styleUrls: ['./board-employee.component.scss']
})
export class BoardEmployeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;

  public dataSource: MatTableDataSource<any> | any;
  public displayedColumns = ['ID', 'title', 'inventoryNumber', 'dateStart', 'type', 'userId'];
  currentUserId: any;
  content?: string;
  materials?: any;
  private subs: SubSink = new SubSink();

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private materialService: MaterialService) {
  }

  ngOnInit(): void {
    this.content = 'Мої матеріали';
    this.currentUserId = this.token.getUser().id;
    this.getAndSetMaterialItems();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      this.userService.getEmployeeBoard().subscribe(
        data => {
          this.content = data;
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
