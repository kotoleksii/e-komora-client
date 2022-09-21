import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroup
} from '@angular/forms';

export class AuthValidators {
  constructor() {
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
    return (formGroup: FormGroup) => {
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
