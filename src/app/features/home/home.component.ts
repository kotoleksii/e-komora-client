import {Component, Inject, OnInit} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DOCUMENT, ViewportScroller} from '@angular/common';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-board-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public content: string = '';

    public readonly showScroll$: Observable<boolean> = fromEvent(
        this.document,
        'scroll'
    ).pipe(
        untilDestroyed(this),
        map(() => this.viewport.getScrollPosition()?.[1] > 0)
    );

    public constructor(@Inject(DOCUMENT) private readonly document: Document,
                       private readonly viewport: ViewportScroller) {
    }

    public ngOnInit(): void {
        this.content = 'Тут колись буде зверстано головну сторінку';
    }

    public onScrollToTop(): void {
        this.viewport.scrollToPosition([0, 0]);
    }

    // private trackByIdFn(_: number, data: { id: number, text: string }): number {
    //     return data.id;
    // }
}
