import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-board-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public content: string = '';

    public constructor() {
    }

    public ngOnInit(): void {
        this.content = 'Тут колись буде зверстано головну сторінку';
    }
}
