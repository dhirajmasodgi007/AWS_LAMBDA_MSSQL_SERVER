/*
var mssql = require('mssql');
'use strict';
console.log("Loading getWODetails function");
var log = require('log');

async function ConnectToDB(mssqlConfig) {
	console.log("ander aa gaya")
	try {
    	await mssql.connect(mssqlConfig, (err) => {
        	if (err) return console.log('Could not create DB Connection!');
        	console.log('Successfully Connected to Database!');
    	});
 		const request = new mssql.Request()
 		var result = await request.query('select 1 as number')
 		console.log(result);
 	} catch(err) {
 		console.log("Caught something!!");
 		console.log(err);
 	}
}
*/
exports.handler =  function(event, context, callback) {
  //var mssql = require('mssql');
var Connection = require('tedious').Connection;

var mssqlConfig =  {
    server: '<DATABASE_Endpoint>',
    database: '<DATABASE_Name>' ,
    port: 1433,
    authentication: {
    type: "default",
    options: {
      userName: '<USER>',
      password: '<PASSWORD>',
        }},
    options: { encrypt: true},
    //ConnectToDB();
};

var connection = new Connection (mssqlConfig);

connection.on('connect', function(err){
    //console.log(err);
    if(err!=null){
         console.log("not connected");
    }
    else{

          console.log("Connected")
          var Request = require('tedious').Request;
          request = new Request("select * from INFORMATION_SCHEMA.TABLES", function(err) {if (err) {
                console.log("Error Caught")
                console.log(err);
          }
          else {
          //console.log(request);
          }});
          connection.execSql(request);
          console.log(request);
          request.on("row", function(cols) {
                cols.forEach((col) => {
                        console.log(col.value);
                        console.log(col.metadata.colName + " " + col.value);
                });
          });
          request.on("requestCompleted", function() {
                console.log("Request done!!");
                connection.close();
         });
    };
});
}

//	async function handler(event, context, callback) {
	/*context.callbackWaitsForEmptyEventLoop = false;
    log('Received event:', JSON.stringify(event, null, 2));
	
var mssqlConfig =  {
    user: 'root',
    password: 'rootroot',
    server: 'test-mssql-db.cuy5gymmwdgn.us-east-1.rds.amazonaws.com',
    database: 'test-mssql-db' ,
	 port:1433,
    options: {
      encrypt: true
  	}
    //ConnectToDB();
}
ConnectToDB(mssqlConfig);
}
  */
