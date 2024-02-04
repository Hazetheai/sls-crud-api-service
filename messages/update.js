import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function updateEntry(event, context) {
  const timestamp = new Date().getTime();
  const data = event.body;

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    throw new createError.InternalServerError(
      "Validation Error: Couldn't update the message item."
    );
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#message_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression:
      'SET #message_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    return response;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(
      "Couldn't update the message item."
    );
  }
}

export const handler = commonMiddleware(updateEntry);
