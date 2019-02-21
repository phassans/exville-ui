let express = require('express');
let router = express.Router();
let request = require('request');
let fs = require('fs');

/*
    @UPLOAD
    @POST
    @info: uploads image. Helper library in app.js
 */
router.post('/', function(req, res) {
  if (req.signedCookies['userId']) {
    let readable = fs.createReadStream(req.files.images.tempFilePath);
    let options = {
      method: 'POST',
      url: 'http://18.218.39.184:8080/v1/uploadimage',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: {
        images: readable,
        userId: parseInt(req.signedCookies['userId'], 10)
      }
    };
    request(options, function(error, groupResponse, groupBody) {
      if (groupResponse.statusCode !== 200) {
        console.error(groupBody)
        res.redirect('/dashboard?source=eupload')
      } else {
        res.redirect('/dashboard?source=upload')
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
