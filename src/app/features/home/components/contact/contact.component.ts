import {Component, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SubSink} from 'subsink';
import {TestService} from '../../../../shared/_services/test.service';
import {NotifierService} from 'angular-notifier';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnDestroy {
    private subs: SubSink = new SubSink();
    public form: FormGroup = {} as FormGroup;

    public constructor(private http: HttpClient,
                       private testService: TestService,
                       private notifierService: NotifierService) {
        this.form = this.initForm();
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            return;
        }
        this.sendForm(this.form);
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    private initForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null),
            email: new FormControl(null),
            message: new FormControl(null)
        });
    }

    private sendForm(formData: FormGroup): void {
        this.subs.add(
            this.testService.sendContactFormMessage(formData.value).subscribe((data) => {
                    this.notifierService.notify('success', `👋 Дякуємо за звернення, ${formData.value.name}!`);
                    this.resetForm(formData);
                },
                ((error: Error) => {
                    this.notifierService.notify('error', error?.message);
                })
            )
        );
    }

    private resetForm(form: FormGroup): void {
        form.reset();
        Object.keys(form.controls).forEach((key) => {
            form.get(key)?.setErrors(null);
        });
        form.setErrors({invalid: true});
    }
}
