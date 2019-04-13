/*
    This function GETS all tasks from Tasks DynamoDB table.
*/

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

exports.handler = async (event, context) => {
    // log function started
    console.log('get-tasks lambda function started...');
    
    // dynamodb info needed for .scan() function that is part of DocumentClient
    const params = {
      TableName: 'Tasks',
      ProjectionExpression: 'task_id, task'
    };
    
    // http response object
    const response = {
        statusCode : 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          'Content-Type': 'application/json' 
        },
        body: ''
    };
    
    try {
      
      let data = await docClient.scan(params).promise();
      const items = data.Items;
      if(items.length === 0) {
        response.statusCode = 404;
        response.body = JSON.stringify("No Items Found!");
        
      } else {
        
        const result = JSON.stringify(data.Items);
        console.log('Success', result);
        response.body = result;
        
      }
      
      // log function ends
      console.log('get-tasks lambda function ends...');
      return response;
      
    } catch(err) {
      
      response.statusCode = 500;
      console.error('ERROR:  ', err);
      return response;
      
    }
    
};


