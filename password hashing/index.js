const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use("/public",express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const conn = require('./connection');
var bcrypt = require('bcryptjs');
const { request } = require('express');
//const salt = bcrypt.genSalt(10);

app.get('/',(req, res) =>{
    res.sendFile(__dirname +"/index.html");
});


app.post('/', (req,res)=>{
    const name = req.body.name;
    const email= req.body.email;
    var password= req.body.password;
    
    let errors = [];

    //Check required fields
    if(!name || !email || !password ){
        errors.push({msg: 'Please fill in all the fields'});
        res.send({message:'Please fill in all the fields'});
    }

    if(errors.length>0){

    }else{
        if(email){
            conn.query('SELECT * FROM signup WHERE email = ?', [email], 
            (error, results, fields)=>{
                if (results.length>0){
                    res.send('Email exists login now');
                }else{
                    res.redirect('/welcome');
                    bcrypt.hash(password, 10, (err, hash)=> {
                        if(err)throw err;
                        password = hash;
                        conn.query('INSERT INTO signup(name, email, password) VALUES("'+name+'", "'+email+'", "'+password+'")',
                        [name, email, password]);
                    });
                }
            });
            }else{
                res.send('Enter Email');
            };
    }
    });

app.get('/welcome',function(req,res){
    res.sendFile(__dirname+ "/welcome.html");
});

app.get('/login',function(req,res){
    res.sendFile(__dirname+ "/login.html");
});



app.post("/login", (req, res)=> {
    const email = req.body.email;
    const password = req.body.password; 
    conn.query("SELECT * FROM signup WHERE email = ?;", email, (err, result)=> {
        if (err) {        
            res.send({err : err});    
        }
        if(result.length > 0){          
            bcrypt.compare(password, result[0].password, (error,response)=>{          
                if(response){           
                    res.redirect('/welcome');         
                }else{            
                    res.send({message:"Email and password does not match"});
                }
            });       
        } else{
            res.send({message:"User does not exist"}); 
        }
    });
});  
                
 


app.listen(4000);