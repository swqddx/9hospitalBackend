/*
 * @Author: your name
 * @Date: 2020-11-26 14:14:25
 * @LastEditTime: 2020-11-26 14:14:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\iot.js
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("100");
});

module.exports = router;