/**
 * This file allows accessing environment variables from
 * a central place in the codebase.
 *
 * It also helps in setting up default values for env-
 * variables in case they are omitted from the actual
 * env files. */

export const ENV = {
  IS_LOCAL: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  WEBSOCKET_BROKER_BASE_URL: process.env.REACT_APP_WEBSOCKET_BROKER_BASE_URL || ''
};
