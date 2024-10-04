import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {UserService} from '../../pages/users-forms/services/user.service';
import {AVAILABLE_COUNTRIES} from '../../pages/users-forms/constants/user-form-fields';
import {DynamicFormErrors} from '../enum/dynamic-form-errors';

export const countryValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const isValueExistInCountryList = AVAILABLE_COUNTRIES.indexOf(control.value) > -1;

  return !isValueExistInCountryList ? {[DynamicFormErrors.IsNotValidCountry]: true} : null;
};

export const userNameValidator = (userService: UserService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    return timer(800).pipe(
      switchMap(() => {
        return userService.checkUsernameAvailable(control.value);
      }),
      map((result: {isAvailable: boolean}) =>
        !result.isAvailable ? {[DynamicFormErrors.IsNotValidUserName]: true} : null,
      ),
    );
  };
};

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = new Date(control.value);
  const currentDate = new Date();

  return date > currentDate ? {[DynamicFormErrors.IsNotValidDate]: true} : null;
};
