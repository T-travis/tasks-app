/*
    This function POSTS a new task to Tasks table in DynamoDB.
*/

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const uuidv1 = require('uuid/v1');

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    // taks from client
    const task = body.task;
    
    // uuid to be the task_is in dynamodb
    const taskUUID = uuidv1();
    
    // http response object
    const response = {
        statusCode : 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          'Content-Type': 'application/json' 
        },
        body: ''
    };
    
    // dynamodb info needed for .put() function that is part of DocumentClient
    const params = {
      TableName: 'Tasks',
      Item: {
        'task_id': taskUUID,
        'task': task,
      }
    };
 
    try {  
        
        await docClient.put(params).promise();
        response.body = JSON.stringify( { 'task_id' : taskUUID } );
        console.log('task created with task_id: ', taskUUID);
        console.log('post-task lambda end');
        return response;
    
    } catch(err) {
        
        response.statusCode = 500;
        response.body = JSON.stringify(err.message);
        console.error('ERROR:  ', err);
        return response;
        
    }
    
};


