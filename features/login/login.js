const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const user = require('../models/mongodb/User');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.route('/')
    .get((req, res) => {
        res.sendFile(__dirname + "/views/trangchu.html");
    })
    .post(function (req, res) {
        var usernameLogin = req.body.usernameLogin;
        var passwordLogin = req.body.passwordLogin;
        console.log(usernameLogin);
        console.log(passwordLogin);
        user.Login(usernameLogin, passwordLogin, function(result){
            if(result == false || result == null){
                res.json({
                    'isValid' : false 
                })
            }else{
                var userID = result;
                res.json({
                    'isValid' : true,
                    userID 
                })
            }
        })
    })

    app.route('/resgister')
    .post(function (req, res) {
          var username = req.body.username;
          var password = req.body.password;
          var name = req.body.name;
          var avatar = req.body.avatar;
          console.log(username);
          console.log(password);
          var userRegister = new user({
              username : username,
              name: name,
              password: password,
              avatar: avatar,
              friend_list : " " ,
              wait_list: ""
          });

          user.CheckUsername(username, function(data){
              if(data == false){
                  user.CreateUser(userRegister, function(result){
                      if(result == null){
                          res.json({
                            'success':  false
                          })
                        }
                        else{
                            res.json({
                                'success': true,
                                result //chỉ có id
                            })
                        }  
                   })
                }
                else{
                    res.json({
                        'success' :  false
                    })
                }
          })      
    })
    app.get('/resgister/:username', (req, res) =>{
        var username = req.params.username;
        user.CheckUsername(username, function(dataResult){
            if(dataResult == false){
                res.json({
                    'isValid' : false
                })
            }else{
                res.json({
                    'isValid' : true
                })
            }
        })
    })

module.exports = app;