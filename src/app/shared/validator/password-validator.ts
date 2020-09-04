import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static passwordValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) { return null; }
    const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{5,50}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  }
}
