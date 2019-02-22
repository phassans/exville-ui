let express = require('express');
let router = express.Router();
let request = require('request');
let config = require('./config');

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
    url: config.baseURL+'refresh',
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
        url: config.baseURL+'usergroups',
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
