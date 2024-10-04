import {Component} from '@angular/core';
import {USER_FORM_FIELDS} from './constants/user-form-fields';
import {DynamicFormGeneratorComponent} from '../../shared/components/dynamic-form-generator/dynamic-form-generator.component';

@Component({
  selector: 'app-users-forms',
  standalone: true,
  imports: [DynamicFormGeneratorComponent],
  templateUrl: './users-forms.component.html',
})
export class UsersFormsComponent {
  public userFormFields = USER_FORM_FIELDS;
}
