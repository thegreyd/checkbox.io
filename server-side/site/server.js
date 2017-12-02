var express = require('express'),
        cors = require('cors'),
	marqdown = require('./marqdown.js'),
	//routes = require('./routes/designer.js'),
	//votes = require('./routes/live.js'),
	//upload = require('./routes/upload.js'),
	create = require('./routes/create.js'),
	study = require('./routes/study.js'),
	admin = require('./routes/admin.js');
var redis = require('redis')
var multer  = require('multer')
var fs      = require('fs')
var health = require('express-ping')
var replace = require("replace");
var npmCheck = require("npm-check")
var app = express();

var client = redis.createClient(6379, '127.0.0.1', {})
client.set("key1",1);

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(health.ping());
});

		 

var whitelist = ['http://chrisparnin.me', 'http://pythontutor.com', 'http://happyface.io', 'http://happyface.io:8003', 'http://happyface.io/hf.html'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

app.options('/api/study/vote/submit/', cors(corsOptions));

/*client.get("key1", function(err, value){
          	if(value==1){
          		 client.set("key1",0);
			 replace({
         	 		 regex: "<h3>Developers</h3>",
          	 		 replacement: "<h3> </h3>",
          	        	 paths: ['/home/ubuntu/checkbox/public_html/index.html'],
 	  	 		 recursive: true,
          	        	 silent: true,
             });
		 
          		}
          	else if(value==0){ 
          		client.set("key1",1);
		        replace({
         	 		 regex: "<h3> </h3>",
          	 		 replacement: "<h3>Developers</h3>",
          	         	 paths: ['/home/ubuntu/checkbox/public_html/index.html'],
 	  	 		 recursive: true,
          	       		 silent: true,
                          });
          		}
          

                  
     
		 
         
		 
	     
 });*/



app.post('/api/design/survey', 
	function(req,res)
	{
		console.log(req.body.markdown);
		//var text = marqdown.render( req.query.markdown );
		var text = marqdown.render( req.body.markdown );
		res.send( {preview: text} );
	}
);

//app.get('/api/design/survey/all', routes.findAll );
//app.get('/api/design/survey/:id', routes.findById );
//app.get('/api/design/survey/admin/:token', routes.findByToken );

//app.post('/api/design/survey/save', routes.saveSurvey );
//app.post('/api/design/survey/open/', routes.openSurvey );
//app.post('/api/design/survey/close/', routes.closeSurvey );
//app.post('/api/design/survey/notify/', routes.notifyParticipant );


//// ################################
//// Towards general study management.
app.get('/api/study/load/:id', study.loadStudy );
app.get('/api/study/vote/status', study.voteStatus );
app.get('/api/study/status/:id', study.status );

app.get('/getPic', function(req, res) {
  client.get("key1", function(err, value){
          	if(value==1){	
                  res.sendfile('/home/ubuntu/checkbox/pinkkk.jpg');
		 }
	  
	        else if (value==0){
		  res.send("NULL");	
		}
         }); 
					
  			
})

app.get('/pingdependency', function(req, res) {
  options = {}
  npmCheck(options)
  .then(currentState => res.send(currentState.get('packages')));
})


app.get('/api/study/listing', study.listing );

app.post('/api/study/create', create.createStudy );
app.post('/api/study/vote/submit/', cors(corsOptions), study.submitVote );

//// ADMIN ROUTES
app.get('/api/study/admin/:token', admin.loadStudy );
app.get('/api/study/admin/download/:token', admin.download );
app.get('/api/study/admin/assign/:token', admin.assignWinner);


app.post('/api/study/admin/open/', admin.openStudy );
app.post('/api/study/admin/close/', admin.closeStudy );
app.post('/api/study/admin/notify/', admin.notifyParticipant);

//// ################################

//app.post('/api/upload', upload.uploadFile );

// survey listing for studies.
//app.get('/api/design/survey/all/listing', routes.studyListing );

// Download
//app.get('/api/design/survey/vote/download/:token', votes.download );
// Winner
//app.get('/api/design/survey/winner/:token', votes.pickParticipant );

// Voting
//app.get('/api/design/survey/vote/all', votes.findAll );
//app.post('/api/design/survey/vote/cast', votes.castVote );
//app.get('/api/design/survey/vote/status', votes.status );
//app.get('/api/design/survey/vote/stat/:id', votes.getSurveyStats );



app.listen(process.env.MONGO_PORT);
console.log('Listening on port 3002...');
