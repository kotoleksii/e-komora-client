import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../../shared/_services/user.service";
import {IUser} from "../../../../../shared/interfaces/user";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
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

  deleteUser(): void {
    this.userService.deleteById(this.currentUser.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/tutorials']).then();
        },
        error: (e) => console.error(e)
      });
  }
}
