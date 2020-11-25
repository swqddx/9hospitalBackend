var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log();
    res.send("返回病人信息");
})

/* get patient list. */
router.get('/patient_list/', function(req, res, next) {
    console.log();
    res.send('respond with a resource');
});

/* edit patient info. */
router.post('/edit_patient/', function(req, res, next) {
    res.send('respond with a resource');
});

/* add patient info */
router.get('/add_patient/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;