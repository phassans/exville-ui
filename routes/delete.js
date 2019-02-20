let express = require('express');
let router = express.Router();
let request = require('request');

/*
    @Delete account
    @GET
    @info: delete account and redirect to home page
 */

router.get('/', function (req, res) {
    if(req.signedCookies['userId']) {
        var groupsRequest = { method: 'POST',
            url: 'http://18.218.39.184:8080/v1/delete',
            headers:
                {'cache-control': 'no-cache',
                    'Content-Type': 'application/json' },
            body: { userId:parseInt(req.signedCookies['userId'],10)  },
            json: true };
        request(groupsRequest,function (error, groupResponse, groupBody) {
            if(groupResponse.statusCode!==200){
                res.render('dashboard' ,{layout:'layout',error:true, errorMessage:"something went wrong"});
            }
            else{
                res.redirect('/')
            }
        })
    }else{
        res.render('home' ,{layout:'layout', home : true, redirect : false});
    }
});


module.exports = router;
