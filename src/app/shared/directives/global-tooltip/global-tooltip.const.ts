export const DEFAULT_TOOLTIP_DELAY = 500;
export const DEFAULT_TOOLTIP_CLASS = 'app-global-tooltip';

export enum TooltipPlacement {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export enum TooltipTrigger {
  Hover = 'hover',
  Click = 'click',
}

export const DefaultTooltipOptions = {
  isAdaptive: false,
  trigger: TooltipTrigger.Hover,
  placement: TooltipPlacement.Bottom,
  className: DEFAULT_TOOLTIP_CLASS,
  delay: DEFAULT_TOOLTIP_DELAY,
};
