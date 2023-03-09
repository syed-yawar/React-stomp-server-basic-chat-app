import { BID_EVENTS } from 'redux/middlewares/socket/types';

export const RESET_LOT_MESSAGES_EVENTS = [
  BID_EVENTS.CLOSE,
  BID_EVENTS.SELL,
  BID_EVENTS.NEXT_UNSOLD,
  BID_EVENTS.UNDOSELL,
];
