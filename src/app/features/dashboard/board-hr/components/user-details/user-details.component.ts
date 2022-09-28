import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../shared/_services/user.service';
import {IUser} from '../../../../../shared/interfaces/user';
import {MatDialog} from '@angular/material/dialog';
import {
  ConfirmDialogModalComponent
} from "../../../../../shared/modals/confirm-dialog-modal/confirm-dialog-modal.component";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() currentUser: IUser = {
    firstName: '',
    lastName: '',
    email: ''
  };

  message = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    public router: Router) {
  }

  ngOnInit(): void {
    this.message = '';
    this.getUser(this.route.snapshot.params.id);
  }

  getUser(id: number): void {
    this.userService.getById(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
        },
        error: (e) => console.error(e)
      });
  }

  deleteUser(id: number): void {
    this.userService.deleteById(id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/tutorials']).then();
        },
        error: (e) => console.error(e)
      });
  }

  openConfirmDialog(id: number, dataToDelete?: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogModalComponent, {
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Ви впевнені?',
        message: `Цю дію не можна скасувати. <br>` +
          `Це назавжди видалить <span class="confirm-message-phrase">${dataToDelete.firstName + ' ' + dataToDelete.lastName}</span> і всі пов'язані дані.`,
        initialValue: dataToDelete,
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.notifierService.notify('success', 'Видалення ' + dataToDelete.lastName + ' успішне!');
        this.deleteUser(id);
      }
      console.log(dialogResult);
    });
  }
}
