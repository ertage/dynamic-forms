import {
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {DefaultTooltipOptions, TooltipPlacement, TooltipTrigger} from './global-tooltip.const';
import {GlobalTooltipComponent} from '../../components/global-tooltip/global-tooltip.component';
import {GlobalTooltipOptions} from './global-tooltip.interface';

@Directive({
  selector: '[appGlobalTooltip]',
  standalone: true,
})
export class GlobalTooltipDirective implements OnInit, OnDestroy {
  @Input() tooltip: string = '';
  @Input() tooltipOptions: GlobalTooltipOptions = DefaultTooltipOptions;

  private componentRef: ComponentRef<any> | null = null;
  private showTimeout: number = 0;
  private hideTimeout: number = 0;
  private isExistTooltip: boolean = false;

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  private createTooltip() {
    if (this.componentRef === null) {
      this.componentRef = this.viewContainerRef.createComponent(GlobalTooltipComponent);

      this.setTooltipComponentProperties();
      this.setCustomClass();

      const [tooltipDOMElement] = (
        (this.componentRef as ComponentRef<GlobalTooltipComponent>).hostView as EmbeddedViewRef<any>
      ).rootNodes;
      document.body.appendChild(tooltipDOMElement);

      this.showTimeout = window.setTimeout(this.show.bind(this), this.tooltipOptions.delay);
      this.isExistTooltip = true;
    }
  }

  public ngOnInit() {
    this.tooltipOptions = {...this.tooltipOptions, ...DefaultTooltipOptions};
  }

  private setTooltipComponentProperties(): void {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      this.componentRef.instance.position = this.tooltipOptions.placement;

      const {left, right, top, bottom} = this.el.nativeElement.getBoundingClientRect();

      switch (this.tooltipOptions.placement) {
        case TooltipPlacement.Bottom: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(bottom);
          break;
        }
        case TooltipPlacement.Top: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(top);
          break;
        }
        case TooltipPlacement.Right: {
          this.componentRef.instance.left = Math.round(right);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case TooltipPlacement.Left: {
          this.componentRef.instance.left = Math.round(left);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private setCustomClass(): void {
    if (this.componentRef) {
      this.componentRef.instance.customClasses = this.tooltipOptions.className
        ? [this.tooltipOptions.className, this.tooltipOptions.placement]
        : [this.tooltipOptions.placement];
    }
  }

  private show(): void {
    (this.componentRef as ComponentRef<GlobalTooltipComponent>).instance.isVisible = true;
  }

  private hideTooltip() {
    this.hideTimeout = window.setTimeout(this.destroy.bind(this), this.tooltipOptions.delay);
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    if (this.tooltipOptions.trigger !== TooltipTrigger.Hover) return;
    this.createTooltip();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.hideTooltip();
  }

  @HostListener('click') onClick(): void {
    if (this.tooltipOptions.trigger !== TooltipTrigger.Click) return;

    if (!this.isExistTooltip) {
      this.createTooltip();
    } else {
      this.hideTooltip();
    }
  }

  public ngOnDestroy() {
    this.destroy();
  }

  private destroy(): void {
    if (this.componentRef !== null) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(this.hideTimeout);
      this.componentRef.destroy();
      this.componentRef = null;
      this.isExistTooltip = false;
    }
  }
}
