import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

async function listEntries(event, context) {
  try {
    const result = await dynamoDb.scan(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };

    return response;
  } catch (error) {
    console.error(error);

    throw new createError.InternalServerError(
      "Couldn't fetch the message items."
    );
  }
}

export const handler = commonMiddleware(listEntries);
