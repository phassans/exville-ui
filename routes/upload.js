let express = require('express');
let router = express.Router();
let request = require('request');
let fs = require('fs');
let multer = require('multer');
let config = require('./config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1])
    }
})

var upload = multer({ storage: storage })

/*
    @UPLOAD
    @POST
    @info: uploads image. Helper library in app.js
 */
router.post('/', upload.single('images'),function(req, res) {
  if (req.signedCookies['userId']) {
      const file = req.file;
      console.log(file);
      if (!file) {
          console.error(error)
      }else{
          let readable = fs.createReadStream(file.path);
          let options = {
              method: 'POST',
              url: config.baseURL+'uploadimage',
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
                  console.error(groupBody);
                  res.redirect('/dashboard?source=eupload')
              } else {
                  fs.unlink(file.path, (err) => {
                      if (err) throw err;
                      console.log('image deleted');
                      res.redirect('/dashboard?source=upload')

                  });
              }
          })
      }
      } else {
    res.render('home', {
      layout: 'layout',
      home: true,
      redirect: false
    });
  }
});

module.exports = router;
