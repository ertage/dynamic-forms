import {Component} from '@angular/core';
import {TooltipPlacement} from '../../directives/global-tooltip/global-tooltip.const';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-global-global-tooltip',
  standalone: true,
  imports: [NgClass],
  templateUrl: './global-tooltip.component.html',
  styleUrl: './global-tooltip.component.scss',
})
export class GlobalTooltipComponent {
  public isVisible = true;
  public customClasses: string[] = [TooltipPlacement.Bottom];
  public tooltip: string = '';
  public left: string = '';
  public top: string = '';
}
