export const parseEvent = (event) => {
  let parsedEvent = {
    body: undefined,
    pathParameters: undefined,
  };

  parsedEvent.pathParameters = event?.pathParameters;

  // Parse body if it is stringified JSON
  if (typeof event?.body === 'string') {
    parsedEvent.body = JSON.parse(event?.body);
  } else {
    parsedEvent.body = event?.body;
  }

  return parsedEvent;
};
