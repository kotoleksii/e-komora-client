import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  UntypedFormGroup
} from '@angular/forms';

export class AuthValidators {
  constructor() {
  }

  public static getErrorMessage(control: AbstractControl, field: string): string {
    if (control.hasError('required')) {
      return `*Поле ${field} обов\`язкове!`;
    }
    if (control.hasError('onlyChar')) {
      return '*Поле має містити лише літери';
    }
    if (control.hasError('minlength')) {
      return '*Поле має містити більше символів';
    }
    if (control.hasError('maxlength')) {
      return '*Поле містить забагато символів';
    }
    if (control.hasError('emailRegex')) {
      return '*Email має бути валідним';
    }
    if (control.hasError('mustMatch')) {
      return '*Паролі не співпадають';
    }
    return '';
  }

  public static emailRegex(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') {
        return null;
      }

      const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      if (emailRegExp.test(control.value)) {
        return null;
      } else {
        return {emailRegex: true};
      }
    };
  }


  public static password(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') {
        return null;
      }

      const passwordRegExp = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
      if (passwordRegExp.test(control.value)) {
        return null;
      } else {
        return {password: true};
      }
    };
  }


  public static onlyChar(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') {
        return null;
      }

      const onlyCharsRegExp = new RegExp('^[a-zA-Z А-ЩЬЮЯҐЄІЇа-щьюяґєії`]*$');
      if (onlyCharsRegExp.test(control.value)) {
        return null;
      } else {
        return {onlyChar: true};
      }
    };
  }

  public static mustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }
}
