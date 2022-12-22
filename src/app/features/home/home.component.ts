import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DOCUMENT, ViewportScroller} from '@angular/common';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-board-news',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('home_wrapper') private homeWrapper!: ElementRef;
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

    public ngAfterViewInit(): void {
        this.onWindowScroll();
    }

    public ngOnInit(): void {
        this.content = 'Тут колись буде зверстано головну сторінку';
    }

    public onScrollToTop(): void {
        this.viewport.scrollToPosition([0, 0]);
    }

    private animOnScroll(): void {
        const animSection = this.homeWrapper?.nativeElement.querySelectorAll('.anim-section');

        if (animSection?.length > 0) {
            for (let i = 0; i < animSection?.length; i++) {
                const elem = animSection[i];
                const elemHeight = elem.offsetHeight;
                const elemOffset = this.offset(elem).top;
                const elemStart = 4;

                let elemPoint = window.innerHeight - elemHeight / elemStart;
                if (elemHeight > window.innerHeight) {
                    elemPoint = window.innerHeight - window.innerHeight / elemStart;
                }

                if ((window.scrollY > elemOffset - elemPoint) && window.scrollY < (elemPoint + elemHeight)) {
                    elem.classList.add('active');
                } else {
                    if (!elem.classList.contains('anim-no-hide')) {
                        elem.classList.remove('active');
                    }
                }
            }
        }
    }

    private offset(el: any): any {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    }

    @HostListener('window:scroll', ['$event'])
    public onWindowScroll(): void {
        this.animOnScroll();
    };

    // private trackByIdFn(_: number, data: { id: number, text: string }): number {
    //     return data.id;
    // }
}
