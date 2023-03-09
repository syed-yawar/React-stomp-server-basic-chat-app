import { Action, Middleware } from '@reduxjs/toolkit';
import { ActivationState, Client } from '@stomp/stompjs';

import { ENV } from 'configs';
import { brokerActions } from 'redux/slices/broker';
import { IBroker, STOMP_ACTION_TYPES, TBrokerMessage } from 'redux/slices/broker/types';

import { STOMP_CONFIG, WEBSOCKET_ENDPOINTS } from './constants';
import { BID_EVENTS, WEBSOCKET_CLOSE_STATUSES } from './types';

/**
 * A singleton function that manages the creation, activation and termination of websocket client.
 * Also, handles the different events and dispatch the actions for the reducers that are written
 * in the broker slice.
 */
export const socketMiddleware: Middleware = store => {
  const { dispatch, getState } = store;

  const client: Client = new Client({
    brokerURL: WEBSOCKET_ENDPOINTS.BROKER,
    reconnectDelay: STOMP_CONFIG.RECONNECTION_DELAY,
    heartbeatIncoming: STOMP_CONFIG.HEARTBEAT_INCOMING,
    heartbeatOutgoing: STOMP_CONFIG.HEARTBEAT_OUTGOING,
    discardWebsocketOnCommFailure: !!STOMP_CONFIG.DISCARD_WEBSOCKET,
  });

  /**
   * A function that terminates the socket client connection.
   */
  const terminateSocket = () => {
    /**
       * If we deactivate the socket and try to reactivate it too soon, as is the case with react fast reload
        for development it will throw an error that the client is still disconnecting, So we forceDisconnect
        the client before deactivating
      */
    if (client.state === ActivationState.ACTIVE) {
      client.forceDisconnect();
      client.deactivate();
    }
  };

  /**
   * A function that handles different events and then dispatch the actions
   * for the reducers that are written in the broker slice.
   * @param parsedData: parsed TBrokerMessage object
   */
  const dispatchMessages = (parsedData: TBrokerMessage) => {
    const { id, event } = parsedData;

    switch (event) {
      case BID_EVENTS.EVENT:
      case BID_EVENTS.LOT:
      case BID_EVENTS.START:
      case BID_EVENTS.STOP:
      case BID_EVENTS.UNDO_BID:
      case BID_EVENTS.NEXT_UNSOLD:
      case BID_EVENTS.MESSAGE:
      case BID_EVENTS.ASK:
      case BID_EVENTS.SELL:
      case BID_EVENTS.BID_SUBMIT:
      case BID_EVENTS.BID_INCREMENT:
      case BID_EVENTS.UNDOSELL:
        //TODO This console is for testing purposes, please remove this in the subsequent ticket.
        console.log(parsedData, event);
        dispatch(brokerActions.updateCurrentLot(getCurrentLotData(parsedData.data)));
        dispatch(brokerActions.addLotMessage(getLotMessages(parsedData)));
        break;
      default:
        return;
    }

    id && dispatch(brokerActions.updateLastEventId(id));
  };

  /**
   * A function that connects/subscribes to the auction channel to receive all the events
   * from the broker stream and then after parsing, passing them to the message handler.
   */
  const onConnect = () => {
    const { lastEventId }: IBroker = getState().broker;
    //TODO Remove this code and get the catalogRef from redux when it's implemented
    const catalogRef = window.location.search.split('a3=')[1];
    const wsConnectionIdentifier = getWSConnectionIdentifier(catalogRef);
    client.subscribe(WEBSOCKET_ENDPOINTS.BROKER_SUBSCRIPTION,
      msg => {
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          if (jsonBody?.text) {
            const parsedData = getParsedBrokerMessage(jsonBody.text);
            dispatchMessages(parsedData);
          }
        }
      },
      { 'Last-Event-ID': lastEventId },
    );
  };

  /**
   * A function that is called when the websocket connection is closed.
   * @param event: A CloseEvent sent to clients using WebSockets when the connection is closed
   */
  const onWebSocketClose = (event: CloseEvent) => {
    if (event.code === WEBSOCKET_CLOSE_STATUSES.UNACCEPTABLE) {
      terminateSocket();
      return;
    }

    ENV.ISLOCAL && console.log(`Exponential back off - next connection attempt in ${client.reconnectDelay}ms`);
  };

  client.onConnect = onConnect;
  client.onWebSocketClose = onWebSocketClose;

  return next => (action: Action) => {
    const { INITIALIZE, TERMINATE } = STOMP_ACTION_TYPES;
    switch (action.type) {
      case INITIALIZE:
        terminateSocket();
        // Calling terminateSocket to disconnect any open connection before activate web socket client.
        client.activate();
        break;
      case TERMINATE:
        terminateSocket();
        break;
      default:
        return next(action);
    }
    return null;
  };
};
