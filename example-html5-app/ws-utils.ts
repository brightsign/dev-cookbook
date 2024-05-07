import { Socket } from 'socket.io-client';
import { get as lodashGet, has as lodashHas, isObject, isString, isInteger, isEmpty } from 'lodash';
import { default as fetch, RequestInit } from 'node-fetch';
import DigestClient from 'digest-fetch';
import { parse, format } from 'url';
import { default as FormData } from 'form-data';
import { join as pathJoin } from 'path';
import { inspect } from 'util';
import { getStatusText } from 'http-status-codes';

import { getConfig } from './config';
import { BrightSignPlayer } from './brightsign/player';

const config = getConfig();
let serial: string;
let player: BrightSignPlayer;
let dwsPort: string | undefined;

/* private functions */

const doGet = async (message: any, socket: Socket) => {
  try {
    const routeUrl = getRouteUrl(message);

    await fetchCall(routeUrl, <RequestInit>{}, message, socket);
  } catch (error) {
    const errMsg = getMessageFromErrorResponse(error, 'Internal Server Error');
    console.error(`Error in doGet: ${errMsg}`);
    message.payload.data = { error: errMsg };
    sendWsResponse(message, socket);
  }
};

const doPutOrPostOrDelete = async (message: any, reqMethod: string, socket: Socket) => {
  try {
    const routeUrl = getRouteUrl(message);

    let options = <RequestInit>{};
    options.method = reqMethod;
    options.headers = message.payload.headers || {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(message.payload.data) || '';

    if (message.payload.route.indexOf('/v1/files') >= 0 && reqMethod === 'PUT' && message.payload.data) {
      // upload files API
      const formData = new FormData();
      let i = 0;
      for (const f of message.payload.data.files) {
        if (f.fileContents && isDataURLWithBase64Encoding(f.fileContents)) {
          // make sure fileContents is a data URL
          f.fileContents = Buffer.from(f.fileContents.split(',')[1], 'base64');
        }
        formData.append('files[' + i + ']', f.fileContents, f.fileName);
        i++;
      }
      // override options: no headers with formData
      options = {
        method: reqMethod,
        body: formData,
      };
    }

    await fetchCall(routeUrl, options, message, socket);
  } catch (error) {
    const errMsg = getMessageFromErrorResponse(error, 'Internal Server Error');
    console.error(`Error in doPutOrPostOrDelete: ${errMsg}`);
    message.payload.data = { error: errMsg };
    sendWsResponse(message, socket);
  }
};

const getRouteUrl = (message: any) => {
  if (!dwsPort) {
    throw new Error('DWS is disabled');
  }
  const route = pathJoin(`${config.dwsBaseRoute}:${dwsPort}/api`, message.payload.route);
  const routeUrl = parse(route);
  // add request query params if available
  if (message.query) {
    const esc = encodeURIComponent;
    const query = Object.keys(message.query)
      .map((k) => esc(k) + '=' + esc(message.query[k]))
      .join('&');

    if (!routeUrl.search) {
      routeUrl.search = '';
    }
    routeUrl.search += query;
  }
  return format(routeUrl);
};

const fetchCall = async (routeUrl: string, options: RequestInit, message: any, socket: Socket) => {
  let res;
  // If password is provided, use digest auth
  if (isNonEmptyString(config.dwsPassword)) {
    const client = new DigestClient('admin', config.dwsPassword, { algorithm: 'MD5' });
    res = await client.fetch(routeUrl, options);
  } else {
    res = await fetch(routeUrl, options);
  }

  console.log(message.type, `received rest response : ${res.status}`);

  let response;
  if (res && res.ok) {
    response = await res.json();
  } else {
    console.error(`received response error code: ${res.status}`);
    response = {
      data: {
        status: res.status,
        error: {
          message: res.statusText,
        },
      },
    };
  }

  if (lodashHas(response, 'data')) {
    message.payload.data = response.data;
    sendWsResponse(message, socket);
  } else {
    console.log('no response required');
    message.payload.data = { result: null };
    sendWsResponse(message, socket);
  }
};

const isDataURLWithBase64Encoding = (s: string) => {
  const splitStringParts = s.split(',');
  if (splitStringParts.length > 1) {
    const regex = /^data:([\w/+.-]+);(charset=[\w-]+|base64).*/i;
    return !!splitStringParts[0].match(regex);
  }
  return false;
};

const sendWsResponse = function (message: any, socket: Socket, type = 'RestResponse') {
  // The new destination is the old source
  message.destination = message.source;
  message.source = {
    type: 'player',
    name: serial,
  };
  message.type = type;

  try {
    if (socket && socket.connected) {
      const route = lodashGet(message, 'payload.route') ? `for ${lodashGet(message, 'payload.route')}` : '';
      const logMessage = `{ ${new Date().toISOString()}} ${message.type} sending response to ${message.destination.name} with id ${message.msgId} ${route}`;
      console.log(logMessage);
      socket.emit('ws_message', message);
    } else {
      console.log('sendWsResponse not sent because the socket is dead');
    }
  } catch (e) {
    const errMsg = getMessageFromErrorResponse(e, 'Internal Server Error');
    console.log(`sendWsResponse throws an error of ${errMsg}`);
  }
};

const handleRestRequest = (message: any, socket: Socket) => {
  if (message.payload && message.payload.route) {
    const routeNoTrailingSlash = message.payload.route.replace(/\/\s*$/, '');
    switch (routeNoTrailingSlash) {
      case '/v1/health':
        message.payload.data = {
          result: {
            status: 'active',
            statusTime: new Date().toISOString(),
          },
        };
        sendWsResponse(message, socket);
        break;

      default: {
        switch (message.payload.method) {
          case 'DELETE':
          case 'POST':
          case 'PUT':
            doPutOrPostOrDelete(message, message.payload.method, socket);
            break;

          default:
            doGet(message, socket);
            break;
        }
      }
    }
  } else {
    console.log('no payload route provided');
    message.payload.data = { error: 'Required parameter missing in the payload: route' };
    sendWsResponse(message, socket);
  }
};

const getDwsPort = async (registry: any) => {
  const dwsPort = await registry.read('networking', 'http_server');
  if (!dwsPort) {
    return '80';
  } else if (dwsPort === '-' || dwsPort === '0') {
    // nop, dws disabled
  } else return dwsPort;
};

const isNonEmptyString = (x: any) => {
  return isString(x) && !isEmpty(x);
};

const isNonEmptyObject = (x: any) => {
  return isObject(x) && !isEmpty(x);
};

/* public functions */

const handleWsMessage = (message: any, socket: Socket) => {
  const route = lodashGet(message, 'payload.route') ? `for ${lodashGet(message, 'payload.route')}` : '';
  const logMessage = `{ ${new Date().toISOString()}} ${message.type} message received from : ${message.source.name} with id ${message.msgId} ${route}`;
  console.log(logMessage);

  if (message.source.type === 'player' && message.source.name === serial) {
    // TODO: make sure the message does not broadcast back to self
    console.log('Message from self, ignoring');
  } else {
    // check that the intended destination is in fact this device serial
    if (message.destination.name === serial) {
      switch (message.type) {
        case 'RestRequest': {
          // Remote DWS requests
          handleRestRequest(message, socket);
          break;
        }
        case 'RestResponse': {
          console.log(`Received response from ${message.source.name}: ${JSON.stringify(message.payload)}`);
          // TODO: make sure the message does not broadcast back to self
          // do nothing, this is a response from the device
          break;
        }
      }
    } else {
      console.log('Message intended for another device, ignoring');
    }
  }
};

const initUtils = async (identifier: string, bsPlayer: BrightSignPlayer) => {
  serial = identifier;
  player = bsPlayer;
  dwsPort = await getDwsPort(player.registry);
};

const getMessageFromErrorResponse = (value: any, theDefault?: string) => {
  try {
    if (value instanceof Error) {
      return value.message || `Error thrown: ${inspect(value)}`;
    } else if (isNonEmptyString(value)) {
      return value;
    } else if (isNonEmptyObject(value)) {
      if (isNonEmptyString(value.message)) {
        return value.message;
      } else if (isNonEmptyString(value.statusText)) {
        return value.statusText;
      } else if (isInteger(value.status)) {
        return getStatusText(value.status);
      }
    }
    if (isNonEmptyString(theDefault)) {
      return theDefault;
    }
  } catch (ex) {
    console.error(`Error in getMessageFromErrorResponse: ${ex}`);
  }
  return 'Unknown error';
};

export { handleWsMessage, initUtils, getMessageFromErrorResponse };
