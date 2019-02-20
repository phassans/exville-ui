let express = require('express');
let router = express.Router();
let request = require('request');

/*
    @Signup
    @POST
    @info: Loads loading bar Page
 */
router.post('/', function (req, res) {
    res.render('loadingBarPage',{layout:'layout', home: false,
        userName: req.body.userName,
        password: req.body.password,
        linkedinURL: req.body.linkedinURL
    })
});


/*
    @singuprequest
    @POST
    @info: receives AJAX request and sends group data
 */
router.post('/signupRequest',function (req, res) {
    let options = { method: 'POST',
        url: 'http://18.218.39.184:8080/v1/signup',
        headers:
            {'cache-control': 'no-cache' },
        body: {userName: req.body.userName,
            password: req.body.password,
            linkedInURL: req.body.linkedinURL },
        json:true};

    request(options, function (error, response, body) {
        if (error) res.render('home' ,{layout:'layout', home : true});
        if(response.statusCode!==200){
            res.status(400).send(body)
        }
        else{
            //fetch groups
            let groupsRequest = { method: 'POST',
                url: 'http://18.218.39.184:8080/v1/usergroups',
                headers:
                    {'cache-control': 'no-cache',
                        'Content-Type': 'application/json' },
                body: { userId: body.userId },
                json: true };
            res.cookie('userId', body.userId,{signed: true});
            request(groupsRequest, function (error, groupResponse, groupBody) {
                if (error) res.render('error',{layout:'layout'});
                if(groupResponse.statusCode!==200){
                    res.status(400).send(body)
                }
                else{
                    res.send(groupBody)
                }
            });
        }
    });
});

module.exports = router;
