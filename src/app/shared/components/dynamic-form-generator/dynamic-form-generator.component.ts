import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  DynamicFormGeneratorFields,
  DynamicFormGeneratorFieldsProps,
} from '../../interface/dynamic-form-generator.interface';
import {
  DEFAULT_FORM_FIELDS,
  MAX_AVAILABLE_FORM_FIELDS_NUMBER,
} from '../../constants/default-form-fields';
import {AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {NgbTooltip, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {DynamicFormFields} from '../../enum/dynamic-form-fields';
import {UserService} from '../../../pages/users-forms/services/user.service';
import {
  countryValidator,
  dateValidator,
  userNameValidator,
} from '../../utils/dynamic-form-validators';
import {ValidationErrorsDirective} from '../../directives/validation-errors/validation-errors.directive';
import {interval, map, Observable, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {countdown} from '../../utils/timer';
import {DEFAULT_TIMER, Seconds} from '../../constants/timer.const';
import {GlobalTooltipDirective} from '../../directives/global-tooltip/global-tooltip.directive';
import {TooltipPlacement} from '../../directives/global-tooltip/global-tooltip.const';

@Component({
  selector: 'app-dynamic-form-generator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    NgbTypeahead,
    NgIf,
    ValidationErrorsDirective,
    NgSwitchDefault,
    AsyncPipe,
    NgbTooltip,
    GlobalTooltipDirective,
  ],
  templateUrl: './dynamic-form-generator.component.html',
  styleUrl: './dynamic-form-generator.component.scss',
})
export class DynamicFormGeneratorComponent implements OnInit {
  @Input() formFields: DynamicFormGeneratorFields = DEFAULT_FORM_FIELDS;

  public dynamicForm: FormGroup = new FormGroup({});
  public fields: DynamicFormGeneratorFieldsProps[] = [];
  public tooltipPlacement: TooltipPlacement = TooltipPlacement.Bottom;

  public isTimerRunning = false;
  public timer: {time: Seconds; timeLabel: string} = DEFAULT_TIMER;
  private timer$: Observable<{time: Seconds; timeLabel: string}> | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
  ) {}

  public ngOnInit() {
    this.initForm();
  }

  public get dynamicFormGroups(): FormArray {
    return this.dynamicForm.get('items') as FormArray;
  }

  public addFormGroup() {
    if (this.dynamicFormGroups.length === MAX_AVAILABLE_FORM_FIELDS_NUMBER) return;

    const item: FormGroup = this.getDefaultFormGroup();
    this.dynamicFormGroups.push(item);
  }

  public removeFormGroup(index: number) {
    this.dynamicFormGroups.removeAt(index);
  }

  public getFormGroupByIndex(index: number) {
    return this.dynamicFormGroups.controls[index] as FormGroup;
  }

  public onSubmit() {
    this.startTimer();

    // TODO: ashvetsova: can be refactored with swichMap

    const subsc = this.timer$
      ?.pipe(
        tap(timer => {
          this.timer = timer;

          if (this.timer.time === 0) {
            this.stopTimer();
          }

          if (this.isTimerRunning) {
            return;
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.dynamicForm.valid && !this.isTimerRunning) {
          this.userService
            .submitUserForm(JSON.stringify(this.dynamicForm.value))
            .pipe(
              tap(_ => this.disableFormGroupControlsField()),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(_ => {
              this.enableFormGroupControlsField();
              this.initForm();
              subsc?.unsubscribe();
            });
        }
      });
  }

  public onCancel(): void {
    this.stopTimer();
  }

  private getDefaultFormGroupControlsFields() {
    this.fields = [];

    return Object.keys(this.formFields).reduce((acc, field) => {
      this.fields.push({...this.formFields[field as DynamicFormFields]});

      return Object.assign(acc, {
        [field]: new FormControl(
          this.formFields[field as DynamicFormFields].value,
          this.getFormGroupControlsFieldValidator(field as DynamicFormFields),
          this.getFormGroupControlsFieldAsyncValidator(field as DynamicFormFields),
        ),
      });
    }, {});
  }

  private getDefaultFormGroup() {
    return this.formBuilder.group(this.getDefaultFormGroupControlsFields());
  }

  private getFormGroupControlsFieldAsyncValidator(
    field: DynamicFormFields,
  ): AsyncValidatorFn | null {
    switch (field) {
      case DynamicFormFields.Username:
        return userNameValidator(this.userService);

      default:
        return null;
    }
  }

  private getFormGroupControlsFieldValidator(field: DynamicFormFields): ValidationErrors | null {
    switch (field) {
      case DynamicFormFields.Country:
        return countryValidator;

      case DynamicFormFields.Birthday:
        return dateValidator;

      default:
        return Validators.required;
    }
  }

  private initForm(): void {
    const formGroupItem: FormGroup = this.getDefaultFormGroup();
    this.dynamicForm = this.formBuilder.group({
      items: this.formBuilder.array([formGroupItem]),
    });
  }

  private disableFormGroupControlsField(): void {
    this.dynamicFormGroups.controls.forEach(control => {
      control.disable();
    });
  }

  private enableFormGroupControlsField(): void {
    this.dynamicFormGroups.controls.forEach(control => {
      control.enable();
    });
  }

  private startTimer(): void {
    this.isTimerRunning = true;
    this.timer = DEFAULT_TIMER;
    this.timer$ = interval(1000).pipe(map(x => countdown(this.timer?.time as Seconds)));
  }

  private stopTimer(): void {
    this.isTimerRunning = false;
    this.timer = DEFAULT_TIMER;
  }
}
