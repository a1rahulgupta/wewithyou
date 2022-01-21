var express = require('express');
var router = express.Router();
var User = require('../models/users');
const sgMail = require('@sendgrid/mail');

let plivo = require('plivo');

let client = new plivo.Client('MANGM4YWYWZDHJMJAWNZ', 'OGUwMjc2YjkyMDI0ZDVkYmFkZTUwMzk4YmFlOTA1');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile('index.html');
});
router.post('/', function (req, res, next) {

  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.subject;
var mobile = req.body.mobile;
  var user = new User({
    name: name,
    email: email,
    subject: subject,
    message: message,
    mobile:mobile
  });
  console.log(user);
  user.save()
    .then(game => {
      res.send(200).json({
        'User': 'User in added successfully'
      }, console.log("user Added"))
      sgMail.setApiKey("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");
      const msg = {
        to: 'info@risingtechinc.in.net',
        from: 'rahulgupta.imt12@gmail.com',
        subject: 'You got a new Query Check mail!',
        text: 'test',
        html: `Hi Sir You got new query on your Website Where
        </br> username is: ${user.name},
        </br> Email is: ${user.email} 
        </br> Subject : ${user.subject} 
        </br> Message : ${user.message}
        </br> MObile No. : ${user.mobile}`,
      };
      sgMail.send(msg);

      client.messages.create(
        '918789858844',
        '919927955351',
        `Hi Sir You got new query on your Website Where
          username is: ${user.name},
          Email is: ${user.email}, 
          Subject : ${user.subject}, 
          Message : ${user.message},
          MObile No. : ${user.mobile}`
      ).then(function(message_created) {
        console.log(message_created)
      });
    })
    .catch(err => {
      res.send(400).send("unable to save to database");
    });
});

module.exports = router;





