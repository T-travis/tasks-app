/*
    This function GETS a task from Tasks DynamoDB table give a task_id as a path parameter.
*/

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});
const isUUID = require('is-uuid');

exports.handler = async (event, context) => {
    // function starts
    console.log('get-task lambda function started...');
    
    // path param id
    const taskID = event.pathParameters['task_id'];
    
    // http response object
    const response = {
        statusCode : 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          'Content-Type': 'application/json' 
        },
        body: ''
    };
    
    // log path param id
    console.log('path param id: ', taskID);
    
    // validate task_id (the dynamodb PK for Tasks table) in uuid version 1
    if(!isUUID.v1(taskID)) {
        response.statusCode = 400;
        response.body = JSON.stringify("Invalid task_id type!");
        return response;
    }
    else {
        
        // dynamodb info needed for .scan() function that is part of DocumentClient
        const params = {
          TableName: 'Tasks',
          Key: { 'task_id': taskID }
        };
        
        try {
          
          let data = await docClient.get(params).promise();
          // if item not found give a 404 response
          if(!data.Item) {
            response.statusCode = 404;
            response.body = JSON.stringify("Item not found!");
            
          } else {
            
            const result = JSON.stringify(data.Item);
            console.log(result)
            console.log('Success', result);
            response.body = result;
            
          }
          
          // log end of function
          console.log('get-task lambda function ends...');
          
          // return http response
          return response;
          
        } catch(err) {
          
          response.statusCode = err.statusCode;
          console.error('ERROR:  ', err);
          return response;
          
        }
    
    }
    
};

