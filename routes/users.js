/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-11-26 14:21:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\routes\users.js
 */

 
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // console.log(req.query);
    res.redirect('/users/login');
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
    const {
        username,
        password
    } = req.query;
    if (username == "admin" && password == "admin") {
        res.send({ status: 'ok' });
    } else {
        res.send(new Error("登陆失败, 用户名或密码错误"));
    }

});



module.exports = router;