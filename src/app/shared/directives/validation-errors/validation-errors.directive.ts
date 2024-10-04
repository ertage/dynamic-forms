import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  OnInit,
  Self,
  ViewContainerRef,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {ValidationErrorsService} from '../../services/validation-errors.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ValidationErrorsComponent} from '../../components/validation-errors/validation-errors.component';

@Directive({
  selector: '[appValidationErrors]',
  standalone: true,
})
export class ValidationErrorsDirective implements OnInit {
  private ref: ComponentRef<ValidationErrorsComponent> | undefined;
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    @Self() private control: NgControl,
    private readonly validationErrorsService: ValidationErrorsService,
  ) {}

  ngOnInit(): void {
    this.control?.statusChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const errorMessage = this.validationErrorsService.getErrorMessage(
        this.control.control?.errors,
      );

      if (!errorMessage) {
        this.el.nativeElement.style.border = '1px solid #f1e9f9';

        if (this.ref) {
          this.ref.instance.error = '';
        }

        return;
      }

      if (!this.ref) {
        this.ref = this.viewContainerRef.createComponent(ValidationErrorsComponent);
      }

      this.el.nativeElement.style.border = '1px solid red';
      this.ref.instance.error = errorMessage;
    });
  }
}
