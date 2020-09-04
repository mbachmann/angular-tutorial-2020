import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NoWhiteSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return {cannotContainSpace: true};
    }
    return null;
  }
}
