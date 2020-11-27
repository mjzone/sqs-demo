'use strict';
const SQS = require('aws-sdk/clients/sqs');
const axios = require('axios');
const sqs = new SQS();

module.exports.dequeue = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
    const location = JSON.parse(event.Records[0].body);
    console.log(location.city);
    if (location.city && location.city.length) {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location.city}&units=metric&APPID=08e3ad0437282f0abefa56ee74ab56af`)
      const answer = `Temperature - ${response.data.main.temp}°C. Humidity - ${response.data.main.humidity}%. ${response.data.weather[0].description} is expected`
      console.log(answer);
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
