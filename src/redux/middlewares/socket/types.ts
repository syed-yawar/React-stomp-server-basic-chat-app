export enum BID_EVENTS {
  EVENT = 'event',
  ASK = 'ask',
  LOT = 'lot',
  SELL = 'sell',
  CLOSE = 'close',
  START = 'start',
  STOP = 'stop',
  MESSAGE = 'message',
  BID_SUBMIT = 'bidSubmit',
  BID_INCREMENT = 'increment',
  NEXT_UNSOLD = 'nextUnsold',
  UNDO_BID = 'undoBid',
  UNDOSELL = 'undoSell',
}

/**
 * https://libwebsockets.org/lws-api-doc-main/html/group__wsclose.html
 * here we can find all the code info when websocket get closed due to some thing
 */
export enum WEBSOCKET_CLOSE_STATUSES {
  UNACCEPTABLE = 1003,
}
