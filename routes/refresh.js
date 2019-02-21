let express = require('express');
let router = express.Router();
let request = require('request');

/*
    @Refresh
    @GET
    @info redirects to refreshpage with loading bar
 */

router.get('/', function(req, res) {
  if (req.signedCookies['userId']) {
    res.render('refreshPage', {
      layout: 'layout',
      home: false,
      userId: parseInt(req.signedCookies['userId'], 10)
    })
  } else {
    res.render('home', {
      layout: 'layout',
      home: true,
      redirect: false
    });
  }

});

/*
    @Refresh
    @GET
    @info: receives AJAX and sends group data.
 */


router.post('/refreshRequest', function(req, res) {
  let options = {
    method: 'POST',
    url: 'http://18.218.39.184:8080/v1/refresh',
    headers: {
      'cache-control': 'no-cache'
    },
    body: {
      userId: parseInt(req.signedCookies['userId'], 10)
    },
    json: true
  };
  request(options, function(error, response, body) {
    if (error) console.error(error)
    if (response.statusCode !== 200) {
      res.status(400).send(body)
    } else {
      //fetch groups
      var groupsRequest = {
        method: 'POST',
        url: 'http://18.218.39.184:8080/v1/usergroups',
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        },
        body: {
          userId: body.userId
        },
        json: true
      };
      request(groupsRequest, function(error, groupResponse, groupBody) {
        if (error) res.render('error', {
          layout: 'layout'
        });
        if (groupResponse.statusCode !== 200) {
          res.status(400).send(body)
        } else {
          res.send(groupBody)
        }
      });
    }
  });
});

module.exports = router;
