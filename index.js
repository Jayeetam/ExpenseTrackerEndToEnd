const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use("/public",express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const conn = require('./connection');

var emailCheck = require('email-check');

app.get('/',(req, res) =>{
    res.sendFile(__dirname +"/index.html");
});

app.post('/',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var sql=`insert into signup(id, name, email, password) values(" ", "${name}", "${email}", "${password}")`;
    conn.query(sql,function(err,results){
        if(err){
            res.send("<h1>Duplicate user found......</h1>");
        };
        res.redirect('/welcome');
        console.log('data saved into database');
        });
});

app.get('/welcome',function(req,res){
    res.sendFile(__dirname+ "/welcome.html");
})

emailCheck('mail@example.com')
  .then(function (res) {
    // Returns "true" if the email address exists, "false" if it doesn't.
  })
  .catch(function (err) {
    if (err.message === 'refuse') {
      // The MX server is refusing requests from your IP address.
    } else {
      // Decide what to do with other errors.
    }
  });

app.listen(4000);