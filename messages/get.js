import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getEntry(event, context) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };

    return response;
  } catch (error) {
    console.error(error);

    throw new createError.InternalServerError(
      "Couldn't fetch the message item."
    );
  }
}

export const handler = commonMiddleware(getEntry);
