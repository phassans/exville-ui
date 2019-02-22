let express = require('express');
let router = express.Router();
let request = require('request');
let config = require('./config');

/*
    @dashboard
    @GET
    @info: renders dashboard and handles error and success messages
 */
router.get('/', function(req, res) {
  //check for cookies
  if (req.signedCookies['userId']) {
    var groupsRequest = {
      method: 'POST',
      url: config.baseURL+'usergroups',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: {
        userId: parseInt(req.signedCookies['userId'], 10)
      },
      json: true
    };
    request(groupsRequest, function(error, groupResponse, groupBody) {
      if (error) res.render('error', {
        layout: 'layout',
        error
      });
      //in case of error redirect to login
      if (groupResponse.statusCode !== 200) {
        res.redirect('/');
      } else {
        //custom upload message
        if (req.query.source === 'upload') {
          res.render('dashboard', {
            layout: 'layout',
            success: true,
            successMessage: "Image uploaded successfully",
            data: groupBody.groups
          });
        } else if (req.query.source === 'resetpassword') {
          //custom message for successful password update
          res.render('dashboard', {
            layout: 'layout',
            success: true,
            successMessage: "Updated password",
            data: groupBody.groups
          });
        } else if (req.query.source === 'eupload') {
          res.render('dashboard', {
            layout: 'layout',
            error: true,
            errorMessage: "something went wrong",
            data: groupBody.groups
          });
        } else {
          //if no success or from login route it to dashboard without headers
          res.render('dashboard', {
            layout: 'layout',
            home: false,
            data: groupBody.groups
          })
        }
      }
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
    @dashboard
    @POST
    @info: Resets password and redirects to dashboard based on success and failure
 */
router.post('/resetPassword', function(req, res) {
  if (req.signedCookies['userId']) {
    var groupsRequest = {
      method: 'POST',
      url: config.baseURL+'changepwd',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: {
        userId: parseInt(req.signedCookies['userId'], 10),
        password: req.body.newPassword
      },
      json: true
    };
    request(groupsRequest, function(error, groupResponse, groupBody) {
      if (groupResponse.statusCode !== 200) {
        // res.render('error', {layout:'layout', home:false, });
        res.render('dashboard', {
          layout: 'layout',
          error: true,
          errorMessage: "something went wrong"
        });
      } else {
        // res.send(groupBody)
        res.redirect('/dashboard' + '?source=resetpassword')
      }
    })
  } else {
    res.render('home', {
      layout: 'layout',
      home: true,
      redirect: false
    });
  }
});


module.exports = router;
