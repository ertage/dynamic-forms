import {Observable} from "rxjs";
import {DynamicFormFields} from "../enum/dynamic-form-fields";

export type DynamicFormGeneratorFields = {
  [key in DynamicFormFields]: any;
};

export interface DynamicFormGeneratorFieldsProps {
  id: string;
  label: string;
  type: string;
  value: string;
  search:() => Observable<string[]>;
}



