

exports.handler =  function(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	
	if (event.email === undefined)
	{
        callback("400 Invalid Input");
    }
	  
var Connection = require('tedious').Connection;

const { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASS } = require('./config_dev');
 

var mssqlConfig =  {
    server: DB_HOST,
    database: DB_DATABASE ,
    port: DB_PORT,
    authentication: {
    type: "default",
    options: {
      userName: DB_USER,
      password: DB_PASS,
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

