/*
    This function UPDATES the Tasks DynamoDB table give a task_id as a path parameter.
*/

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const isUUID = require('is-uuid');

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    // task and task_id from client
    const task = body.task;
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
    
    // validate task_id from body, must be a uuid v1
    if(!isUUID.v1(taskID)) {
        response.statusCode = 400;
        response.body = JSON.stringify("Invalid task_id type!");
        return response;
    }
    else {
        
    
        // dynamodb info needed for .update() function that is part of DocumentClient
        const params = {
          TableName: 'Tasks',
          Key: {
            'task_id': taskID
          },
          // if this task_id is not in the table throw an error
          ConditionExpression: 'attribute_exists(task_id)',
          UpdateExpression: "set task = :task",
          ExpressionAttributeValues:{
            ":task":task
          },
          ReturnValues:"ALL_NEW"
          };
     
        try {  
            
            // the assumption is the client gives a real task_id, if not .update()
            // will give an error and be handled in the catch
            const updatedData = await docClient.update(params).promise();
            response.body = JSON.stringify( { 
                'task_id' : updatedData.Attributes['task_id'],
                'task' : updatedData.Attributes.task
            });
            console.log('task updated with task_id: ', taskID);
            console.log('post-task lambda end');
            return response;
        
        } catch(err) {
            
            response.statusCode = err.statusCode;
            response.body = JSON.stringify(err.message);
            console.error('ERROR:  ', err);
            return response;
            
        }
    
    }
    
};



