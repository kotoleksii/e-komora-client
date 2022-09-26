import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {IUser} from '../../../shared/interfaces/user';

@Component({
  selector: 'app-board-hr',
  templateUrl: './board-hr.component.html',
  styleUrls: ['./board-hr.component.scss']
})
export class BoardHrComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;

  public dataSource: MatTableDataSource<any> | any;
  public displayedColumns = ['avatar', 'firstName', 'lastName', 'post', 'id'];
  public users: any;

  imageWidth = 30;
  imageMargin = 2;
  showImage = false;

  content?: string;
  private subs: SubSink = new SubSink();

  constructor(private userService: UserService) {
  }

  public getAndSetUserItems(): void {
    this.subs.add(
      this.userService.getAll().subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
  }


  public getUsers(): void {
    this.subs.add(
      this.userService.getAll()
        .subscribe({
          next: (data) => {
            this.users = data;
          },
          error: (e) => console.error(e)
        }));
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  ngOnInit(): void {
    this.getUsers();
    this.getAndSetUserItems();

    this.subs.add(
      this.userService.getHRBoard().subscribe(
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
