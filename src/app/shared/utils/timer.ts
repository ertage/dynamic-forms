import {Seconds, TIME_PREFIX} from '../constants/timer.const';

export const countdown = (seconds: Seconds) => {
  if (seconds > 0) {
    seconds--;
  }

  return {
    time: seconds,
    timeLabel: `${TIME_PREFIX}${seconds}`,
  };
};
