import { Injectable } from '@angular/core';
import {DynamicFormErrors} from "../enum/dynamic-form-errors";
import {ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorsService {

  public getErrorMessage(errors: ValidationErrors | null | undefined) {
    if (!errors) return '';

    return Object.keys(errors)
      .map(key => {
        return this.getValidationErrors(key);
      })
      .join('. ');
  }

  private  getValidationErrors(key: string) {
    switch (key) {
      case  DynamicFormErrors.IsNotValidCountry:
        return 'Please provide a correct Country';

      case  DynamicFormErrors.IsNotValidUserName:
        return 'Please provide a correct Username';

      case  DynamicFormErrors.IsNotValidDate:
        return 'Please provide a correct Birthday';

      default:
        return 'Please provide a correct value'
    }

  }
}
