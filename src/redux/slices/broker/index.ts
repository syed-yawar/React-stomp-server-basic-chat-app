import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BID_EVENTS } from 'redux/middlewares/socket/types';

import { RESET_LOT_MESSAGES_EVENTS } from './constants';
import { IMiddlewareAction, STOMP_ACTION_TYPES, IBroker, ICurrentLot, TBrokerDisplayMessage } from './types';

const initialState: IBroker = {
  currentLotData: null,
  displayMessages: [],
  lastEventId: '',
};

export const brokerSlice = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    updateLastEventId: (state, action) => {
      state.lastEventId = action.payload;
    },
    updateCurrentLot: (state, action: PayloadAction<ICurrentLot>) => {
      state.currentLotData = action.payload;
    },
    addLotMessage: (state, action: PayloadAction<TBrokerDisplayMessage[]>) => {
      const [messageData] = action.payload || {};
      const { event } = messageData || {};

      if (RESET_LOT_MESSAGES_EVENTS.includes(event as BID_EVENTS)) {
        state.displayMessages = [];
      }
      state.displayMessages.push(...action.payload);
    },
  },
});

export const brokerActions = brokerSlice.actions;
export const brokerReducer = brokerSlice.reducer;

/**
 *  An action to initiate web socket connection.
 */
export const initiateSocketConnection = (): IMiddlewareAction => ({ type: STOMP_ACTION_TYPES.INITIALIZE });
/**
 *  A action to terminate web socket connection.
 */
export const terminateSocketConnection = (): IMiddlewareAction => ({ type: STOMP_ACTION_TYPES.TERMINATE });
