import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/_services/auth.service';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';
import {Router} from '@angular/router';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AuthValidators} from '../../shared/classes/AuthValidators';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnDestroy {
    private subs: SubSink = new SubSink();
    public errorMsg = AuthValidators.getErrorMessage;
    public isSuccessful = false;
    public isSignUpFailed = false;
    public submitted = false;
    public hide = true;
    public errorMessage = '';
    public registerForm = new UntypedFormGroup(
        {
            firstName: new UntypedFormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                AuthValidators.onlyChar()
            ]),
            lastName: new UntypedFormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                AuthValidators.onlyChar()
            ]),
            email: new UntypedFormControl('', [
                Validators.required,
                AuthValidators.emailRegex()
            ]),
            password: new UntypedFormControl('', [
                Validators.required,
                Validators.minLength(8),
                AuthValidators.password()
            ]),
            confirmPassword: new UntypedFormControl('', [Validators.required])
        },
        AuthValidators.mustMatch('password', 'confirmPassword')
    );


    public constructor(private authService: AuthService,
                       private notifierService: NotifierService,
                       private router: Router) {
    }

    public checkControlUppercase(control: AbstractControl): boolean {
        return !(!control.value.split('').find((char: any) => !/[a-z]/.test(char) && /[A-Z]/.test(char)) &&
            control.touched);
    }

    public checkControlLowercase(control: AbstractControl): boolean {
        return !(!control.value.split('').find((char: any) => /[a-z]/.test(char) && !/[A-Z]/.test(char)) &&
            control.touched);
    }

    public onSubmit(): void {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.subs.add(
            this.authService.register(
                this.registerForm.value.firstName,
                this.registerForm.value.lastName,
                this.registerForm.value.email,
                this.registerForm.value.password
            ).subscribe(
                data => {
                    // console.log(data);
                    this.isSuccessful = true;
                    this.isSignUpFailed = false;
                    this.notifierService.notify('success', 'Реєстрація успішна!');
                    this.router.navigate(['login']).then();
                },
                (err) => {
                    this.errorMessage = err.error.message;
                    this.isSignUpFailed = true;
                    if (err.status === 400) {
                        this.notifierService.notify('error', 'Такі Ім`я або Email вже зайняті!');
                        return;
                    }
                    this.notifierService.notify('error', 'Signup failed!');
                }
            ));
        // this.success = JSON.stringify(this.registerForm.value);
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public get f(): any {
        return this.registerForm.controls;
    }
}
