import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenStorageService} from '../../shared/_services/token-storage.service';
import {Router} from '@angular/router';
import {SubSink} from 'subsink';
import {MaterialService} from '../../shared/_services/material.service';
import {BehaviorSubject} from 'rxjs';
import {TestService} from '../../shared/_services/test.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    private roles: string[] = [];
    public currentUser: any;
    public userId: number = 0;
    public username?: string;
    public amountMaterials: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    // public navLinks: any[] = [];
    public activeLinkIndex = -1;
    public isLoggedIn: boolean = false;
    public showHome: boolean = false;
    public showAccountantBoard: boolean = false;
    public showHRBoard: boolean = false;
    public showEmployeeBoard: boolean = false;
    public showNewsMakerBoard: boolean = false;
    public navItems: Array<any> = [];

    public constructor(private router: Router,
                       private tokenStorageService: TokenStorageService,
                       private testService: TestService,
                       private materialService: MaterialService) {
    }

    public ngOnInit(): void {
        this.currentUser = this.tokenStorageService.getUser();
        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
            this.userId = this.currentUser.id;
            this.roles = this.currentUser.roles;
            this.username = `${this.currentUser.firstName} ${this.currentUser.lastName}`;

            this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');
            this.showHRBoard = this.roles.includes('ROLE_HR');
            this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');
            this.showNewsMakerBoard = this.roles.includes('ROLE_NEWS_MAKER');
        }

        this.subs.add(
            this.router.events.subscribe(() => {
                this.activeLinkIndex = this.navItems.indexOf(this.navItems.find((tab) => tab.link === '.' + this.router.url));
            })
        );

        this.navItems = this.initNavItems();
        this.getAmountMaterials();
    }

    public getAmountMaterials(): any {
        this.subs.add(
            this.materialService.getAmountMaterialsByUserId(this.userId)
                .subscribe((data) => {
                    this.amountMaterials.next(data);
                }));
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    private initNavItems(): Array<any> {
        return [
            {index: 0, access: this.showEmployeeBoard, link: './news', title: 'Новини'},
            {index: 1, access: this.showEmployeeBoard, link: './employee', title: 'Мій інвентар'},
            {index: 2, access: this.showHRBoard, link: './hr', title: 'Кадри'},
            {index: 3, access: this.showAccountantBoard, link: './accountant', title: 'Бухгалтерія'},
            {index: 4, access: this.showNewsMakerBoard, link: './news-maker', title: 'Пресслужба'}
        ];
    }
}
