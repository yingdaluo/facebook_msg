var proxy = require('express-http-proxy');
var app = require('express')();

var server_port = process.env.PORT || 8080;

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

app.post('/facebook_send_message', function (req, res) {
  var facebookAppState = req.body.facebookAppState
  var message = req.body.message
  var targetUsers = req.body.targetUsers

  login({appState: JSON.parse(facebookAppState)}, (err, api) => {
    if (err) return res.status(401).send({error: 'failed to login!'});
    targetUsers.forEach(function(targetUser) {
      api.getUserID(targetUser, (err, data) => {
          if(err) return res.status(500).send({error: 'sending failed!'});

          // Send the message to the best match (best by Facebook's criteria)
          var msg = {
            body: message
          }
          var threadID = data[0].userID;
          api.sendMessage(msg, threadID);
      });
    });
    res.status(200).send();
  });
});

app.listen(server_port);
