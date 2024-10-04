import {TooltipPlacement, TooltipTrigger} from './global-tooltip.const';

export interface GlobalTooltipOptions {
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  className?: string;
  delay?: number;
}
