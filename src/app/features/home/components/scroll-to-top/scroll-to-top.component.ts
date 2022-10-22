import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent {
    @Output() public scrollToTop = new EventEmitter<void>();

    public constructor() {
    }

    public onScrollToTop(): void {
        this.scrollToTop.emit();
    }

}
