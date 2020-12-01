/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-12-01 16:13:16
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
    const { id } = req.query;
    const info = req.body;
    const command = Object.keys(info).map((item) => {
        return item + '=\'' + info[item] + '\''
    }).join(', ');
    const command_all = 'UPDATE patient_list SET ' + command + ' WHERE id=?'
    mysql.query(command_all, [id]).then((result) => {
        res.json({ status: "success", data: result });
    }).catch((err) => {
        res.json({ data: err, status: "error", });
    });
});

/* add patient info */
router.post('/add_patient/', function (req, res) {
    const info = req.body;
    const command_key = Object.keys(info).map((item) => {
        return item;
    }).join(',');
    const command_value = Object.keys(info).map((item) => {
        return '"'+ info[item] + '"';
    }).join(',');
    const command_all = 'INSERT INTO patient_list ('+ command_key +') VALUES  ('+ command_value + ')';
    console.log(command_all);
    mysql.query(command_all).then((result) => {
        res.json({ status: "success", data: result });
    }).catch((err) => {
        res.json({ data: err, status: "error", });
    });
});

module.exports = router;