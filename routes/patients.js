/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-11-30 16:03:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\patients.js
 */
var express = require('express');
var router = express.Router();

var mysql = require('../modules/database/mysql');
const Mysql = new mysql();

router.get('/', function (req, res, next) {
    console.log();
    res.send("返回病人信息");
})

/* get patient list. */
router.get('/patient_list/', function (req, res, next) {
    let content  = Mysql.select();
    console.log(content);
    // res.send(String(content));
});

/* edit patient info. */
router.post('/edit_patient/', function (req, res, next) {
    res.send('respond with a resource');
});

/* add patient info */
router.get('/add_patient/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;