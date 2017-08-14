var mongo = require('mongodb');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var validUrl = require('valid-url');

mongoose.connect('mongodb://koutron:poopoo12@ds129281.mlab.com:29281/koutron');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED');
  var urlSchema = mongoose.Schema({
    longUrl : String,
    bitUrl : String
  });
  var url = mongoose.model('url', urlSchema);
  
  
  
  app.get('*', (req, res) => {
  var path = (req.path.toString().slice(1));
    if(path.length == 6){
      return url.findOne({bitUrl : path}, (err, doc) => {
      //if(!doc) return res.send('Invalid Bitlink URL');
      if(doc) res.redirect(doc.longUrl);
      else res.send('Invalid Bitlink.');
      
      });
    }
    else{
  return url.findOne({longUrl : path}, (err, docs) => {
    if(validUrl.isUri(path)){
      console.log('URL IS VALID');
    
    if(!docs){
        console.log("CREATING NEW BITLINK");
        var newUrl = new url({longUrl : path});
  return newUrl.save((err, urlInfo) => {
    urlInfo.bitUrl = urlInfo.id.slice(-6);
    urlInfo.save();
    res.send("Your Bitlink has been created at https://bitlink.glitch.me/" + urlInfo.bitUrl);
  });
      }
      if(docs){
        console.log("BITLINK ALREADY EXISTS");
        res.send('Bitlink already exists at https://bitlink.glitch.me/' + docs.bitUrl);
      }
    }
    else{
      res.send("URL is invalid.");   
    }
  });
  
    }//////////
  
  
  
  
 
 

    

  

res.end(); 
}); //app.get
}); //db.once


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
  
var listener = app.listen(process.env.PORT, function () {
console.log('Your aps listening on port ' + listener.address().port);
});//

