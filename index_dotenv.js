

exports.handler =  function(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	
	if (event.email === undefined)
	{
        callback("400 Invalid Input");
    }
	  
var Connection = require('tedious').Connection;
const dotenv = require('dotenv');

const config =dotenv.config();  // This will read your .env file, parse the contents, assign it to process.env and return an object with a parsed
// key containing the loaded content or an error key if it failed.


// const config =dotenv.config({path : '/custom/path/of/file/having/env/details'}); //DEFAULT value is path.resolve(process.cwd(), '.env')
// const config =dotenv.config({encoding : 'latin1'}); // we specify the encoding of our file containing env variables. DEFAULT value is utf8
// const config =dotenv.config({debug : process.env.DEBUG});  // DEFAULT value is false
 

if(config.error)
{
    throw config.error;
}
// console.log(config.parsed)  // This will out the configuration details if found.

var mssqlConfig =  {
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE ,
    port: process.env.DB_PORT,
    authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER,
      password: process.env.PORT,
        }},
    options: { encrypt: true},
    
};

var connection = new Connection (mssqlConfig, callback);

connection.on('connect', function(err){
	
	var _rows = [];
    
    if(err!=null){
         console.log("not connected");
    }
    else{

          console.log("Connected");
          var Request = require('tedious').Request;
		  console.log("SELECT top 3 activityid, orderid_activity_version  FROM [FLEXEDGE_PI_DEV].[FLEXEDGE_FORM_DEV].[GoCanvas_WRUGeneralActivity_Initiate_Version_2] where username='" + event.email + "'");
          request = new Request("SELECT top 3 activityid, orderid_activity_version  FROM [FLEXEDGE_PI_DEV].[FLEXEDGE_FORM_DEV].[GoCanvas_WRUGeneralActivity_Initiate_Version_2] where username='" + event.email + "'", function(err, rowCount) {if (err) {
                console.log("Error Caught")
                console.log(err);
          }
          else {
          console.log(rowCount + ' rows');
		
			
          }
			
		  });
          connection.execSql(request);
		   _rows = [];

       
          request.on("row", function(cols) {
			    var _item = {};
                cols.forEach((col) => {
					_item[col.metadata.colName] = col.value;
				});
				console.log(JSON.stringify(_item) + '   item contain');
				_rows.push(_item);
				console.log(' _rows content are ' + JSON.stringify(_rows));
		  });
		  
		
		  
          request.on("requestCompleted", function() {
                console.log("Request done!!");
				console.log('rows carry ' + JSON.stringify(_rows))
				connection.close();
				callback(null, _rows);
		 });
    };
});
}

