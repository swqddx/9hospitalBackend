/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-11-30 22:19:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\patients.js
 */
var express = require('express');
var router = express.Router();



var Mysql = require('../modules/database/mysql');
const mysql = new Mysql();

router.get('/', function (req, res, next) {
    console.log();
    res.send("返回病人信息");
})

/* get patient list. */
router.get('/patient_list/', function (_req, res) {
    mysql.query('SELECT id, name, surgery_doctor, age  FROM patient_list').then((result) => {
        res.json(result);
    }).catch((err) => {
        res.send("something error");
    })
});

/* get patient details. */
router.get('/patient_details/', function (req, res) {
    const { id } = req.query;
    mysql.query('SELECT * FROM patient_list WHERE id=?', [id]).then((result) => {
        if (result.length === 1) {
            res.json(result[0]);
        } else {
            res.send("something error");
        }
    }).catch((err) => {
        res.send("something error");
    });
})

/* edit patient info. */
router.post('/edit_patient/', function (req, res) {
    const { } = req.body;
    mysql.query('Update ', [id]).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.send("something error");
    });
});

/* add patient info */
router.get('/add_patient/', function (req, res) {
    const { } = req.body;
    mysql.query('SELECT * FROM patient_list WHERE id=?', [id]).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.send("something error");
    });
});

module.exports = router;