import {Country} from "../../../shared/enum/country";
import {availableCountriesFromList} from "../../../shared/utils/countries-mapper";
import {debounceTime, distinctUntilChanged, map, Observable} from "rxjs";
import {DynamicFormFields} from "../../../shared/enum/dynamic-form-fields";

export const AVAILABLE_COUNTRIES = availableCountriesFromList(Country);

export const USER_FORM_FIELDS = {
  [DynamicFormFields.Country]: {
    id: DynamicFormFields.Country,
    type: 'typeahead',
    label: 'Country',
    value: '',
    search: (searchText$: Observable<string>) => {
      return searchText$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2 ? [] : AVAILABLE_COUNTRIES.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    )}
  },
  [DynamicFormFields.Username]: {
   id: DynamicFormFields.Username,
   type: 'text',
   label: 'Username',
    value: '',
  },
  [DynamicFormFields.Birthday]: {
    id: DynamicFormFields.Birthday,
    type: 'date',
    label: 'Birthdate',
    value: '',
  },
}
