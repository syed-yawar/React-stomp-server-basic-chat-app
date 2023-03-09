import { ENV } from 'configs';

export const WEBSOCKET_ENDPOINTS = {
  BROKER: `${ENV.WEBSOCKET_BROKER_BASE_URL}/am2b/ws`,
  BROKER_SUBSCRIPTION: '/topic/messages',
};

export const STOMP_CONFIG = {
  RECONNECTION_DELAY: 1000,
  HEARTBEAT_INCOMING: 1000,
  HEARTBEAT_OUTGOING: 0,
  DISCARD_WEBSOCKET: true,
};