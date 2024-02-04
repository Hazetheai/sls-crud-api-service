import AWS from 'aws-sdk';
import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import commonMiddleware from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createEntry(event, context) {
  const timestamp = new Date().getTime();
  const data = event.body;
  console.log('data', data);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed');
    throw new createError.InternalServerError(
      "Validation Error: Couldn't create the message item."
    );
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuidv4(),
      text: data.text,
      checked: false,
      replyTo: data.replyTo,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    return response;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(createEntry);
