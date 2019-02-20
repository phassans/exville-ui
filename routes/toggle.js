let express = require('express');
let router = express.Router();
let request = require('request');

/*
    @Toggle
    @POST
    @info: toggles between groups. Does not renders anything.
 */
router.post('/', function (req, res) {
    //cookie check
    if(req.signedCookies['userId']) {
        var groupsRequest = { method: 'POST',
            url: 'http://18.218.39.184:8080/v1/usergroup/toggle',
            headers:
                {'cache-control': 'no-cache',
                    'Content-Type': 'application/json' },
            body: { userId:parseInt(req.signedCookies['userId'],10), group:req.body.group, status: (req.body.status ==='true')  },
            json: true };
        request(groupsRequest,function (error, groupResponse, groupBody) {
            if(groupResponse.statusCode!==200){
                res.json({success:false})
            }
            else{
                res.json({success:true})
            }
        })
    }else{
        console.error("error . cookie deleted")
    }
});

module.exports = router;
