var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/workouts', function(req, res) {
  console.log('hrere');
    var db = req.db;
  var collection = db.get('fitnessTracker');
  collection.find({},{sort:"activityDate"},function(e,docs){
    res.json(docs);
  });
});

/* POST to adduser. */
router.post('/addWorkout', function(req, res) {
  var db = req.db;
  var collection = db.get('fitnessTracker');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deleteuser. */
router.delete('/deleteWorkout/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('fitnessTracker');
  var activityToDelete = req.params.id;
  collection.remove({ '_id' : activityToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
