let express = require('express');
let router = express.Router();
let request = require('request');

/*
    @Login
    @POST
    @info: Redirects to dashboard and sets cookies
 */
router.post('/', function(req, res) {
    let options = { method: 'POST',
        url: 'http://18.218.39.184:8080/v1/login',
        headers:
            {'cache-control': 'no-cache' },
        body: {userName: req.body.userName,    password: req.body.password  } ,
        json: true};

    request(options, function (error, response, body) {
        if (error) res.render('error',{layout:'layout'});
        if(response.statusCode !==200){
            res.render('home' ,{layout:'layout', home : true, redirect : false, error:true, errorMessage:"Wrong credentials"});

        }else {
            //set encrypted cookie
            res.cookie('userId', body.user.UserID,{signed: true});
            req.userID =body.user.UserID;
            //redirects to dashboard route
            res.redirect('/dashboard');

        }
        });
});

module.exports = router;
