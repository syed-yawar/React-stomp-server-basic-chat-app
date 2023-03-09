export type TBrokerDataItem = {
  askPrice: string;
  currentBid: string;
  currency: string;
  currentWinner: string;
  lotNumber: string;
};

export type TCurrentLotData = {
  auctionState: AUCTION_STATES;
  message: string;
  items: TBrokerDataItem[];
};

export type TBrokerDisplayMessage = {
  id: number;
  event: string;
  message: string;
};

export interface ICurrentLot {
  lotNumber: string | null;
  askPrice: string;
  currentBid: string;
  currentWinner: string;
}

export type TBrokerMessage = {
  id: number;
  event: string;
  data: TCurrentLotData;
};

export interface IBroker {
  currentLotData: ICurrentLot | null;
  displayMessages: TBrokerDisplayMessage[];
  lastEventId: string;
}

export interface IMiddlewareAction {
  type: string;
}

export enum AUCTION_STATES {
  CLOSED = 'Closed',
  IN_PROGRESS = 'InProgress',
  PAUSED = 'Paused',
  TERMINATED = 'Terminated',
}

export enum STOMP_ACTION_TYPES {
  INITIALIZE = 'START_STOMP',
  TERMINATE = 'STOP_STOMP',
}
