import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [
    NgIf
  ],
  template: '<p *ngIf="error" class="error">{{ error }}</p>',
  styleUrl: './validation-errors.component.scss'
})
export class ValidationErrorsComponent {
 @Input() error: string = '';
}
