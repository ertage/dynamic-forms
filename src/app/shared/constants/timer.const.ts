export type Seconds = number & { brands__ : 'seconds' };

export const TIME = 5;
export const TIME_PREFIX = '0:0'
export const DEFAULT_TIMER = {time: 5 as Seconds, timeLabel:`${TIME_PREFIX }${TIME}`}
