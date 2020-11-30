/*
 * @Author: your name
 * @Date: 2020-11-26 14:14:25
 * @LastEditTime: 2020-11-28 22:31:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\iot.js
 */
var express = require('express');
var router = express.Router();

let Lux = 0, Temp = 0, Hum = 0, Press = 0;
let set = 0;
/* GET home page. */
router.get('/', function (req, res, next) {
    Lux = req.query.Lux;
    Temp = req.query.Temp;
    Hum = req.query.Hum;
    Press = req.query.Press;
    res.send(set.toString());
});

router.get('/info', function (req, res, next) {
    res.json({
        Lux, Temp, Hum, Press
    });
})

router.get('/set', function (req, res, next){
    set = Number(req.query.set);
    res.send(set.toString());
})

module.exports = router;