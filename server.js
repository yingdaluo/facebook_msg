var proxy = require('express-http-proxy');
var app = require('express')();

var server_port = process.env.PORT || 3000;

const login = require("facebook-chat-api");
var bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/facebook_login', function (req, res) {
  var user = req.body.fbUser
  var password = req.body.fbPass
  login({email: user, password: password}, (err, api) => {
    if(err)
      res.status(500).send({error: 'failed to login!'});
    res.status(200).send(JSON.stringify(api.getAppState()));
  });
});

app.listen(server_port);
