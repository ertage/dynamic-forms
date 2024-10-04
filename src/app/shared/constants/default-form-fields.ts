import {DynamicFormFields} from '../enum/dynamic-form-fields';

export const DEFAULT_FORM_FIELDS = {
  [DynamicFormFields.Username]: {
    id: DynamicFormFields.Username,
    type: 'text',
    label: '',
    value: '',
  },
  [DynamicFormFields.Country]: {
    id: DynamicFormFields.Country,
    type: 'text',
    label: '',
    value: '',
  },
  [DynamicFormFields.Birthday]: {
    id: DynamicFormFields.Birthday,
    type: 'date',
    label: '',
    value: '',
  },
};

export const MAX_AVAILABLE_FORM_FIELDS_NUMBER = 10;
