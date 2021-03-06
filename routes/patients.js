/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-12-06 14:07:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\patients.js
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var moment = require('moment');

var fs = require('fs');
var _ = require('lodash');

// const { path } = require('../app');

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

const storgeCt = multer.diskStorage({
    destination: function (_req, _file, callback) {
        try {
            fs.mkdirSync(`${process.cwd()}\\public\\file\\${_req.id}`, { recursive: true });
        } catch (err) {
            console.log(err);
        }
        callback(null, `${process.cwd()}\\public\\file\\${req.id}`);
    },
    filename: function (req, file, callback) {  // file上传的文件信息, callback 重命名处理
        let filename = (file.originalname).split('.');  //['文件名','文件后缀'] eg: 1.png
        callback(null, `${filename[0]}_${Date.now()}.${filename[filename.length - 1]}`); //参数1 null ,参数2 时间戳+后缀
    }
})

const upload = multer({ storage: storgeDefault })
const ct_upload = multer({
    storage: storgeCt
})

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
            // console.log(result);
            res.json(result[0]);
        } else {
            res.send("something error");
        }
    }).catch((err) => {
        res.send("something error");
    });
})

router.get('/patient_schedule/', function (req, res) {
    const { id } = req.query;
    const itemslist = [
        {
            name: "stage_1",
            label: "首次就诊",
            status: "",
            time: "",
            children: [
                { name: "maxillofacial_panorama", label: "颌面部全景图", status: "", time: "" },
                { name: "maxillofacial_CT", label: "颌面部CT图", status: "", time: "" },
                { name: "joint_MRI", label: "颞下关节MRI", status: "", time: "" },
                { name: "dental_model", label: "白石膏牙模", status: "", time: "" },
                { name: "clinical_examination", label: "临床检查", status: "", time: "" },
            ]
        },
        {
            name: "stage_2",
            label: "二次就诊",
            status: "",
            time: "",
            children: [
                { name: "CT_reconstruction", label: "CT重建", status: "", time: "" },
                { name: "model_scanning", label: "牙模激光扫描", status: "", time: "" },
                { name: "threedimensional_design", label: "三维设计", status: "", time: "" },
            ]
        },
        {
            name: "stage_3",
            label: "手术",
            status: "",
            time: "",
            children: [
                { name: "design_review", label: "设计方案确定", status: "", time: "" },
                { name: "guide_printing", label: "合金导板打印", status: "", time: "" },
                { name: "operation", label: "手术", status: "", time: "" },
            ]
        },
        {
            name: "stage_4",
            label: "术后复诊",
            status: "",
            time: "",
            children: [
                { name: "occlusion_check", label: "咬合关系检查", status: "", time: "" },
                { name: "faceshape_evaluation", label: "面形评估", status: "", time: "" },
                { name: "imaging_panorama", label: "影像学全景片", status: "", time: "" },
                { name: "positioning_film", label: "头颅定位片", status: "", time: "" },
                { name: "CT_examination", label: "CT检查", status: "", time: "" },
            ]
        }
    ]
    mysql.query('SELECT * FROM patient_schedule WHERE patient=?', [id]).then((result) => {
        const schedule = result[0];
        Object.keys(schedule).map((item) => {
            if (item.includes("_time")) {
                let name = item.split("_time")[0];
                itemslist.map((stage) => {
                    if (stage.name === name) {
                        stage.time = schedule[item];
                    } else {
                        stage.children.map((child) => {
                            if (child.name === name) {
                                child.time = schedule[item];
                            }
                        })
                    }
                })

            }
            if (item.includes("_status")) {
                let name = item.split("_status")[0];
                itemslist.map((stage) => {
                    if (stage.name === name) {
                        stage.status = schedule[item];
                    } else {
                        stage.children.map((child) => {
                            if (child.name === name) {
                                child.status = schedule[item];
                            }
                        })
                    }
                })
            }
        });
        res.json(itemslist);
    }).catch((err) => {
        res.send(err);
    });
})

router.get('/edit_schedule/', function (req, res) {
    const { id } = req.query;
    const { key } = req.query;
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    
    mysql.query('UPDATE patient_schedule SET '+ key +'_status='+ '\'completed\''+', '+ key +'_time=\''+ time+'\' WHERE patient=?', [id]);

    // console.log('UPDATE patient_schedule SET '+ key +'_status='+ '\'completed\''+', '+ key +'_time=\''+ time+'\' WHERE patient=?');

    let itemslist = [
        {
            name: "stage_1",
            label: "首次就诊",
            status: "",
            time: "",
            children: [
                { name: "maxillofacial_panorama", label: "颌面部全景图", status: "", time: "" },
                { name: "maxillofacial_CT", label: "颌面部CT图", status: "", time: "" },
                { name: "joint_MRI", label: "颞下关节MRI", status: "", time: "" },
                { name: "dental_model", label: "白石膏牙模", status: "", time: "" },
                { name: "clinical_examination", label: "临床检查", status: "", time: "" },
            ]
        },
        {
            name: "stage_2",
            label: "二次就诊",
            status: "",
            time: "",
            children: [
                { name: "CT_reconstruction", label: "CT重建", status: "", time: "" },
                { name: "model_scanning", label: "牙模激光扫描", status: "", time: "" },
                { name: "threedimensional_design", label: "三维设计", status: "", time: "" },
            ]
        },
        {
            name: "stage_3",
            label: "手术",
            status: "",
            time: "",
            children: [
                { name: "design_review", label: "设计方案确定", status: "", time: "" },
                { name: "guide_printing", label: "合金导板打印", status: "", time: "" },
                { name: "operation", label: "手术", status: "", time: "" },
            ]
        },
        {
            name: "stage_4",
            label: "术后复诊",
            status: "",
            time: "",
            children: [
                { name: "occlusion_check", label: "咬合关系检查", status: "", time: "" },
                { name: "faceshape_evaluation", label: "面形评估", status: "", time: "" },
                { name: "imaging_panorama", label: "影像学全景片", status: "", time: "" },
                { name: "positioning_film", label: "头颅定位片", status: "", time: "" },
                { name: "CT_examination", label: "CT检查", status: "", time: "" },
            ]
        }
    ]

    mysql.query('SELECT * FROM patient_schedule WHERE patient=?', [id]).then((result) => {
        const schedule = result[0];
        Object.keys(schedule).map((item) => {
            if (item.includes("_time")) {
                let name = item.split("_time")[0];
                itemslist.map((stage) => {
                    if (stage.name === name) {
                        stage.time = schedule[item];
                    } else {
                        stage.children.map((child) => {
                            if (child.name === name) {
                                child.time = schedule[item];
                            }
                        })
                    }
                })

            }
            if (item.includes("_status")) {
                let name = item.split("_status")[0];
                itemslist.map((stage) => {
                    if (stage.name === name) {
                        stage.status = schedule[item];
                    } else {
                        stage.children.map((child) => {
                            if (child.name === name) {
                                child.status = schedule[item];
                            }
                        })
                    }
                })
            }
        });
        itemslist.map((stage, index )=>{
            if(stage.status == 'processing'){
                let changed = 1;
                stage.children.map((child)=>{
                    if(child.status == 'processing' ){
                        changed = 0;
                    }
                })
                if(changed == 1){
                    let command_all='UPDATE patient_schedule SET '+ stage.name +'_status='+ '\'completed\'' + ', ' + stage.name + '_time=' + '\'' + time + '\'';
                    if(index<3){
                        const command = itemslist[index+1].children.map((child)=>{
                            return child.name + '_status=\'processing\', ' + child.name + '_time=' + '\'' + moment(time).add(1, "days").format("YYYY-MM-DD HH:mm:ss") + '\'';
                        }).join(', ');
                        command_all = command_all +', ' + command + ', ' + itemslist[index+1].name + '_status=' + '\'processing\'' + ', ' + itemslist[index+1].name + '_time=' + '\'' + moment(time).add(1, "days").format("YYYY-MM-DD HH:mm:ss") + '\' WHERE patient=?';
                    } else {
                        command_all = command_all + ' WHERE patient=?';
                    }
                    mysql.query(command_all, [id]);
                }
            }
        })
        res.json({status: 'success'});
    }).catch((err) => {
        res.send(err);
    });
})

router.get('/add_schedule/', function (req, res) {
    const { id } = req.query;
    let command_all = 'INSERT INTO patient_schedule (patient, stage_1_status, stage_1_time, joint_MRI_status, joint_MRI_time, maxillofacial_panorama_status, maxillofacial_panorama_time, maxillofacial_CT_status, maxillofacial_CT_time, dental_model_status, dental_model_time, clinical_examination_status, clinical_examination_time, ';
    command_all = command_all + 'stage_2_status, CT_reconstruction_status, model_scanning_status, threedimensional_design_status, ';
    command_all = command_all + 'stage_3_status, design_review_status, guide_printing_status, operation_status, ';
    command_all = command_all + 'stage_4_status, occlusion_check_status, faceshape_evaluation_status, imaging_panorama_status, positioning_film_status, CT_examination_status) VALUES (';
    command_all = command_all + '\'' + id + '\'';

    command_all = command_all + (' ,\'processing\'' + ', \'' + moment().format("YYYY-MM-DD HH:mm:ss") + '\'').repeat(6);
    command_all = command_all + (' ,\'uncompleted\'').repeat(14) + ')';
    console.log(command_all);
    mysql.query(command_all).then((result) => {
        res.json({ status: "success", data: result });
    }).catch((err) => {
        res.json({ data: err, status: "error", });
    });
})

router.get('/ct_list/', function (req, res) {
    const { id } = req.query;
    mysql.query('SELECT * FROM ct_list WHERE patient=?', [Number(id)]).then((result) => {
        // console.log(result);
        res.json(result);
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
    // console.log(command_all);
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
    res.json({ size, mimetype, encoding, path });
});

router.post('/save_ct/', ct_upload.single('file'), function (req, res) {
    const { id } = req.query;
    const { path, encoding, size, mimetype } = req.file;
    // mysql.query(`UPDATE ? SET ?=${path.split('\\public')[1]} WHERE ?=?`, [table_name, column_name, primary_key, primary_value]).then(() => {
    //     try {
    //         res.json();
    //     } catch (err) {
    //     }
    // });
    res.json({ size, mimetype, encoding, path });
})

module.exports = router;