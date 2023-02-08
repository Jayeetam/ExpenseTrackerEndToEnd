const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use("/public",express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const conn = require('./connection');


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
                    res.send('Email exists');
                }else{
                    res.redirect('/welcome');
                    conn.query('INSERT INTO signup(name, email, password) VALUES("'+name+'", "'+email+'", "'+password+'")',
                    [name, email, password]);
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


app.post('/login', (req, res)=> {
    const email = req.body.email;
    const password = req.body.password

    if (email && password) {
        conn.query('SELECT password FROM signup WHERE email = ? AND password = ?', [email,password], 
        (error, results, fields)=> {
            if (results.length > 0 ) {
                res.redirect('/welcome');
                console.log('user login successful')
            } 
            else {
                return res.status(401).json({message:"User not authorized"}); 
            }
        });

    } else {
        return res.status(404).json({message:"User not found"}); 
    }
});

app.listen(4000);
