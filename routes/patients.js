/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-12-02 11:17:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\patients.js
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var moment = require('moment');
var fs = require('fs');

const { path } = require('../app');

// const fileFilter = function (req, file, cb) {
//     console.log("fileFilter: ", file);
//     cb(null, true);
// }

const storgeDefault = multer.diskStorage({
    destination: function (_req, _file, callback) {
        try {
            fs.mkdirSync(`${process.cwd()}\\public\\files\\${moment().format('YYYYMM')}`, { recursive: true });
        } catch (err) {
            console.log(err);
        }
        callback(null, `${process.cwd()}\\public\\files\\${moment().format('YYYYMM')}`);
    },
    filename: function (req, file, callback) {  // file上传的文件信息, callback 重命名处理
        let filename = (file.originalname).split('.');  //['文件名','文件后缀'] eg: 1.png
        callback(null, `${filename[0]}_${Date.now()}.${filename[filename.length - 1]}`); //参数1 null ,参数2 时间戳+后缀
    }
});

const upload = multer({ storage: storgeDefault })

var Mysql = require('../modules/database/mysql');
const mysql = new Mysql();

router.get('/', function (req, res, next) {
    res.send("返回病人信息");
})

/* get patient list. */
router.get('/patient_list/', function (_req, res) {
    mysql.query('SELECT id, name, surgery_doctor, age, image  FROM patient_list').then((result) => {
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
            console.log(result);
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
        // console.log("result: ", result);
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
        return '"' + info[item] + '"';
    }).join(',');
    const command_all = 'INSERT INTO patient_list (' + command_key + ') VALUES  (' + command_value + ')';
    console.log(command_all);
    mysql.query(command_all).then((result) => {
        res.json({ status: "success", data: result });
    }).catch((err) => {
        res.json({ data: err, status: "error", });
    });
});

// interface fileIProps {
//     fieldname: string, 
//     originalname: string,
//     encoding: string,
//     mimetype: string,
//     destiantion: string,
//     filename: string,
//     path: string,
//     size: number
// }

/* fetch files and save in local, then get the path of files */
router.post('/save_file/', upload.single('file'), function (req, res) {
    const { table_name, primary_key, column_name, primary_value } = req.query;
    const { path, encoding, size, mimetype } = req.file;
    // mysql.query(`UPDATE ? SET ?=${path.split('\\public')[1]} WHERE ?=?`, [table_name, column_name, primary_key, primary_value]).then(() => {
    //     try {
    //         res.json();
    //     } catch (err) {
    //     }
    // });
    console.log(111, path);
    // path.split('\\public')[1]
    res.json({ size, mimetype, encoding, path });
});

module.exports = router;