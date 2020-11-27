'use strict';
const SQS = require('aws-sdk/clients/sqs');
const sqs = new SQS();

module.exports.dequeue = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
    const location = JSON.parse(event.Records[0].body);
    console.log(location.city);
    if (location.city && location.city.length) {
      console.log(`It's always sunny in ${location.city}`);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify("success")
      });
    } else {
      throw new Error("Undefined inputs...")
    } 
};

module.exports.enqueue = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    console.log(event.queryStringParameters);
    if (event.queryStringParameters) {
      const params = {
        MessageBody: JSON.stringify(event.queryStringParameters),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/885121665536/WeatherRequestQueue"
      }
      const result = await sqs.sendMessage(params).promise();
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result),
      })
    }
  } catch (e) {
    console.log(e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify("Request failed"),
    })
  }
};
