const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
let mongoose = require('mongoose');

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Schema for UserLog
const userLogSchema = mongoose.Schema({
  username: { type: String },
  count: { type: Number, default: 0},
  _id: String,
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
});

// Creates a UserLog model
const UserLog = mongoose.model("UserLog", userLogSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create a new user
app.post('/api/users', (req, res) => {
  const newUserLog = new UserLog({username: req.body.username, _id: uuidv4().replace(/-/gi, '')});
  newUserLog.save((err, data) => {
    if (err) {
      res.sendStatus(500); // send error
    } else {
      res.json({ username: req.body.username, _id: uuidv4().replace(/-/gi, '') });
    }
  })
});

// Add exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  
  // Sets date in dateFormat depending on whether user has provided it or not
  let exerciseDate = req.body.date == "" ? new Date().toDateString(): new Date(Date.parse(req.body.date)).toDateString();

  const update = {
    description: req.body.description,
    duration: req.body.duration,
    date: exerciseDate,
  }
  //res.json(update);

  UserLog.findOneAndUpdate({ _id: req.body._id }, update, (err, updatedUserLog) => {
    if (err) {
      res.sendStatus(404); // user log not found
    } else {
      const exercise = {
        username: updatedUserLog.username,
        description: updatedUserLog.description,
        duration: updatedUserLog.duration,
        date: updatedUserLog.date,
        _id: updatedUserLog._id
      }
      res.json(exercise);
    }
  })
});

// Get full exercise log for any user
app.get('/api/users/:_id/logs', (req, res) => {
  // TODO: query db using user id
  // TODO: get username, count, array of all exercises
});

// Get a user's exercise log
app.get('/api/users/:_id/logs[from][&to][&limit]', (req, res) => {

});

// Returns an array of userlog objects from the database
app.get('/api/users', (req, res) => {
  UserLog.find().select(['username', '_id']).exec((err, userLogs) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(userLogs);
    }
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
